const keystone = require('keystone');
const Types = keystone.Field.Types;

const Location = new keystone.List('Location');

Location.add({
	name: { type: String, unique: true },
	aliases: { type: Types.TextArray },
});

Location.schema.pre('save', cb => {});

// TODO: Add pre-save to make sure name and aliases are unique before saving

Location.defaultColumns = 'name';
Location.register();
