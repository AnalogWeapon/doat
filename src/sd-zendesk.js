const axios = require('axios');

const sdzdBaseUrl = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/`;

class SDZendesk {
	#client;
	#info = {
		id: {
			form: {
				default: 0,
				registration: 41707469490203
			},
			field: {
				serial_regex: 41706805709211
			}
		}
	};

	get info() {
		return this.#info;
	}

	constructor() {
		this.#client = axios.create({
			baseURL: sdzdBaseUrl,
			headers: {
				'Authorization': 'Basic ' + Buffer.from(`${process.env.ZENDESK_USERNAME}:${process.env.ZENDESK_API_TOKEN}`).toString('base64'),
				'Host': `${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`,
				'content-type': 'application/json'
			}
		});
	}

	async direct_request(url) {
		if (url.startsWith(sdzdBaseUrl) === false) {
			throw new Error(`I won't fetch ${url}`);
		}
		const r = await this.#client.get(url);
		return r.data;
	}

	async get_ticket(ticket_id) {
		const r = await this.#client.get(`tickets/${ticket_id}`);
		return r.data.ticket;
	}

	// Details: https://developer.zendesk.com/api-reference/ticketing/users/users/#show-user
	async get_user(user_id) {
		const r = await this.#client.get(`users/${user_id}`);
		return r.data.user;
	}

	async get_agents() {
		const r = await this.#client.get('users?role=agent');
		return r.data;
	}

	// Details: https://developer.zendesk.com/api-reference/custom-data/custom-objects/custom_object_records/#search-custom-object-records
	async search_custom_object_records(custom_object_name, search_string, sort = 'name', page_size = 5) {
		const r = await this.#client.get(`custom_objects/${custom_object_name}/records/search?query=${search_string}&sort=${sort}&page[size]=${page_size}`);
		return r.data;
	}

	// Details: https://developer.zendesk.com/api-reference/custom-data/custom-objects/custom_object_records/#update-custom-object-record
	// for some reason, it wants is all wrapped in { custom_object_record: obj }
	async update_custom_object_record(custom_object_name, record_id, update_obj) {
		const r = await this.#client.patch(`custom_objects/${custom_object_name}/records/${record_id}`, { custom_object_record: update_obj });
		return r;
	}
}

module.exports = { SDZendesk };

// custom_field_41873576892699