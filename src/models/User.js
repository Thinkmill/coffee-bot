const keystone = require('keystone');
const Types = keystone.Field.Types;
const User = new keystone.List('User');

User.add({
	email: { type: Types.Email },
	password: { type: Types.Password },
	slackId: { type: String, unique: true },
});

User.schema.virtual('canAccessKeystone').get(function() {
	return true;
});

User.defaultColumns = 'slackId, email';
User.register();
