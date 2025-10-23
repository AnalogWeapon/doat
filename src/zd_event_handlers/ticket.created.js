const { SDZendesk } = require('../src/sd-zendesk');
const sdz = new SDZendesk();

module.exports = (event_info) => {
	console.log('ticket.created fired');
}