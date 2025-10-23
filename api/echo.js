const { validate_request } = require('../src/validate_request');

export default function handler(req, res) {
	validate_request(req, res, 'POST');
	res.status(200).json({ received: req.body });
}