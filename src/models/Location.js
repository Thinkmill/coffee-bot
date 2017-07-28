const keystone = require('keystone');

const Location = new keystone.List('Location');

Location.add({
	name: { type: String, unique: true },
});

Location.defaultColumns = 'name';
Location.register();
