var slack = require('slack');
var bot = slack.rtm.client();
var token = process.env.SLACK_TOKEN;

module.exports = () => {
	bot.message(message => {
		console.log('message', message);
		if (message.subtype !== 'bot_message') {
			slack.chat.postMessage(
				{ text: 'hi', channel: message.channel, token },
				console.log
			);
		}
	});

	// start listening to the slack team associated to the token
	bot.listen({ token: token });
};
