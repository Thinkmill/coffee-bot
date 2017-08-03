const keystone = require('keystone');
const Types = keystone.Field.Types;
const Item = new keystone.List('Item');

Item.add({
	location: { type: Types.Relationship, ref: 'Location' },
	name: { type: String },
	// Price is in cents
	price: { type: Number },
	aliases: { type: Types.TextArray },
});

// TODO: Add pre-save to make sure name and aliases are unique to location before saving

Item.defaultColumns = 'name, location';
Item.register();
