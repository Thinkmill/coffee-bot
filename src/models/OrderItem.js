const keystone = require('keystone');
var Types = keystone.Field.Types;

const OrderItem = new keystone.List('OrderItem');

OrderItem.add({
	run: { type: Types.Relationship, ref: 'Run' },
	user: { type: Types.Relationship, ref: 'User' },
	item: { type: Types.Relationship, ref: 'Item' },
	channeldId: { type: String },
});

OrderItem.defaultColumns = 'name, location';
OrderItem.register();
