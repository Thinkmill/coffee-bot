const slack = require('slack');
const token = process.env.SLACK_TOKEN;
const { priceToDollars } = require('./utils');

class Plugin {
	constructor({ text, user, channel }) {
		this.text = text;
		this.userId = user;
		this.channelId = channel;
		this.explanation = 'This command has no explanation yet, sorry!';
		this.name = 'The Unnamed Command';
	}

	test() {
		if (!this.testRegex) return false;
		return this.testRegex.test(this.text);
	}

	priceToDollars(priceInCents) {
		return priceToDollars(priceInCents);
	}

	action() {
		return 'This action has not been defined';
	}

	async run() {
		if (this.test()) {
			const returnMessage = await this.action();
			if (returnMessage) {
				slack.chat.postMessage(
					{ text: returnMessage, channel: this.channelId, token },
					console.log
				);
			}
		}
	}
}

module.exports = Plugin;
