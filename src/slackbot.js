const slack = require('slack');
const bot = slack.rtm.client();
const token = process.env.SLACK_TOKEN;
const languageParser = require('./languageParser');

module.exports = () => {
	bot.message(async message => {
		console.log('message', message);
		if (message.subtype !== 'bot_message') {
			const returnMessage = await languageParser(message);
			slack.chat.postMessage(
				{ text: returnMessage, channel: message.channel, token },
				console.log
			);
		}
	});

	// start listening to the slack team associated to the token
	bot.listen({ token: token });
};
