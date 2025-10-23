function validate_request(req, res, method)
{
	const key = req.headers['x-api-key'];
	const expectedKey = process.env.API_KEY || 'test123';

	if (key !== expectedKey) {
		res.status(401).json({ error: 'Invalid API key' });
		return false;
	}

	if (req.method !== method) {
		res.status(405).json({ error: `Only ${method} allowed` });
		return false;
	}

	return true;
}

module.exports = { validate_request };