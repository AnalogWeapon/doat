const { validate_request } = require('../src/validate_request');
const { SDZendesk } = require('../src/sd-zendesk');

const sdz = new SDZendesk();

const eventHandlers = {};

handlerContext.keys().forEach(filePath => {
	// filePath will be something like './ticket.created.js'
	// Extract the key (e.g., 'ticket.created')
	const eventName = path.basename(filePath, '.js'); 
	
	// Load the module and store it in our map
	eventHandlers[eventName] = handlerContext(filePath);
});

export default async function handler(req, res) {
	try {
		validate_request(req, res, 'POST');
		const event_info = req.body;

		console.log(event_info);

		// todo: dynamic require, if possible

		res.status(200).json({});
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
}