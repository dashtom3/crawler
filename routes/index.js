'use strict';


import data from './data'
export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/data', data);
	
}