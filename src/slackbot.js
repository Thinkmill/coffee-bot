var slack = require('slack');
var bot = slack.rtm.client();
var token = process.env.SLACK_TOKEN;

module.exports = () => {
	// do something with the rtm.start payload
	bot.started(function(payload) {
		console.log('payload from rtm.start', payload);
	});

	// respond to a user_typing message
	bot.user_typing(function(msg) {
		console.log('several people are coding', msg);
	});

	// start listening to the slack team associated to the token
	bot.listen({ token: token });
};
