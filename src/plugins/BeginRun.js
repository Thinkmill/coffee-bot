// coffee some strings
const keystone = require('keystone');
const Location = keystone.list('Location');
const User = keystone.list('User');
const Run = keystone.list('Run');
const { Command } = require('slack-bot-commands');

class BeginRun extends Command {
	constructor(message) {
		super(message);
		this.testRegex = /^open run:? (.*)/i;
		this.name = 'Start Run';
	}

	async action() {
		const name = this.text.match(this.testRegex)[1];
		const information = await Promise.all([
			Location.model.findOne({ name }),
			User.model.findOne({ slackId: this.userId }),
			Run.model
				.findOne({ channelId: this.channelId, openRun: true })
				.populate('location'),
		]);
		let [location, user, run] = information;
		if (run)
			return `There is already a run in progress for ${run.location.name}.`;
		if (!location)
			return `I don't know anything about ${name}. Run "new place ${name}" to add it.`;
		if (!user) user = await new User.model({ slackId: this.userId }).save();
		const newRun = new Run.model({
			location: location.id,
			user: user.id,
			channelId: this.channelId,
			openRun: true,
		});
		await newRun.save();
		return `new run created for ${name}`;
	}
}

module.exports = BeginRun;
