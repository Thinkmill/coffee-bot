if (process.env.NODE_ENV === 'production') {
	require('./lib');
} else {
	require('dotenv').config();
	require('babel-register');
	require('./src');
}
