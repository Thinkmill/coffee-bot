class Plugin {
	constructor({ text, user, channel }) {
		this.text = text;
		this.userId = user;
		this.channelId = channel;
		this.explanation = 'This command has no explanation yet, sorry!';
	}

	test() {
		if (!this.testRegex) return false;
		return this.testRegex.test(this.text);
	}

	action() {
		return 'This action has not been defined';
	}
}

module.exports = Plugin;
