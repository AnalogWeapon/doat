const { validate_request } = require('../src/validate_request');
const { SDZendesk } = require('../src/sd-zendesk');
const sdz = new SDZendesk();

export default async function handler(req, res) {
	try {
		validate_request(req, res, 'POST');
		const ticket_info = req.body.detail; // https://developer.zendesk.com/api-reference/webhooks/event-types/ticket-events/

		// id: ticket id
		// actor_id, requester_id, submitter_id: id of the user who submitted the ticket?
		// ticket_info: id of the ticket form

		// Registration

		if (ticket_info.form_id == sdz.info.id.form.registration) {
			const ticket = await sdz.get_ticket(ticket_info.id);
			const user = await sdz.get_user(ticket_info.submitter_id);
			const serial = ticket.custom_fields.find(f => f.id == sdz.info.id.field.serial_regex).value || null;

			if (serial != null) {
				const device_search = await sdz.search_custom_object_records('device', serial);
				let device = null;

				if (device_search.custom_object_records.length  > 1)
				{
					const filtered_devices = device_search.custom_object_records.filter(d => d.name == serial);
					if (filtered_devices.length == 1) {
						device = filtered_devices[0];
					}
					else {
						// found more than one device. that's bad
						throw new Error({
							message: `Registration process found multiple/no ${filtered_devices.length} devices when searching on serial ${serial}. Registration failed`,
							data: device_search.custom_object_records
						});
					}
				}
				else if (device_search.custom_object_records.length == 1) {
					device = device_search.custom_object_records[0];
				}
				else {
					// found no devices. 
					// todo: create the device
					throw new Error({
						message: `Found no device on serial ${serial}. Automatic creation of device not yet implemented. Registration failed`
					});
				}

				const device_update = {
					custom_object_fields: {
						registered_user: user.id
					}
				};
				const r = await sdz.update_custom_object_record('device', device.id, device_update);
				console.log(`Registered ${serial} to ${user.name}`);
				// todo: check result, if possible
				// todo: resolve ticket if registration successful
			}
			else {
				// the registration ticket form doesn't have a serial number field (or not the one we expect). that's bad
				throw new Error({
					message: `Registration process got null serial on submission somehow. Registration failed`
				});
			}
		}

		res.status(200).json({});
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
}