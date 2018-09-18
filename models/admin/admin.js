'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const adminSchema = new Schema({
	city: { type: Schema.Types.ObjectId, ref: 'City' },
	date: String,
	shidu: String,
	pm25: Number,
	pm10: Number,
	quality: String,
	wendu: Number,
	ganmao: String,
})


const Admin = mongoose.model('Admin', adminSchema);


export default Admin
