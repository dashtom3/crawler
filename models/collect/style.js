'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const styleSchema = new Schema({
    number: String,       //款式
    color : String,       //颜色
    store:[{ type: Schema.Types.ObjectId, ref: 'store' }]
})

const Style = mongoose.model('Style', styleSchema);


export default Style

