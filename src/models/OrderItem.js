const keystone = require('keystone');
var Types = keystone.Field.Types;

const OrderItem = new keystone.List('OrderItem');

OrderItem.add({
	run: { type: Types.Relationship, ref: 'Run' },
	orderingUser: { type: Types.Relationship, ref: 'User' },
	runningUser: { type: Types.Relationship, ref: 'User' },
	item: { type: Types.Relationship, ref: 'Item' },
});

OrderItem.defaultColumns = 'name, location';
OrderItem.register();
