const keystone = require('keystone');
const Location = keystone.list('Location');
const Plugin = require('../Plugin');

class AddNewLocation extends Plugin {
	constructor(message) {
		super(message);
		this.testRegex = /^new place:? (.*)/i;
		this.name = 'Add New Location';
	}

	async action() {
		const name = this.text.match(this.testRegex)[1].trim();
		const location = await Location.model.findOne({ name: name });

		if (location)
			return 'this place already exists! No sweat, just start a run.';
		const newLocation = new Location.model({ name });
		await newLocation.save();
		return `added new location: ${name}`;
	}
}

module.exports = AddNewLocation;
