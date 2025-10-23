const { validate_request } = require('../src/validate_request');
const { SDZendesk } = require('../src/sd-zendesk');
const sdz = new SDZendesk();

export default async function handler(req, res) {
	try {
		validate_request(req, res, 'POST');
		var users = await sdz.get_users();
		res.status(200).json(users);
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
}