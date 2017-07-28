const keystone = require('keystone');

const Location = keystone.list('Location');
const Item = keystone.list('Item');
module.exports = async function(cb) {
	const skittle = new Location.model({ name: 'skittle' });
	await skittle.save();
	await new Item.model({
		location: skittle.id,
		name: 'large cap',
		price: 400,
	}).save();
	cb();
};
