const { validate_request } = require('../src/validate_request');
const { SDZendesk } = require('../src/sd-zendesk');
const sdz = new SDZendesk();

export default async function handler(req, res) {
	try {
		validate_request(req, res, 'POST');
		var r = await sdz.direct_request(req.body.url);
		res.status(200).json(r);
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
}