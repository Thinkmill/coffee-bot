const keystone = require('keystone');
const Types = keystone.Field.Types;
const Item = new keystone.List('Item');

Item.add({
	location: { type: Types.Relationship, ref: 'Location' },
	name: { type: String },
	// Price is in cents
	price: { type: Number },
});

Item.defaultColumns = 'name, location';
Item.register();
