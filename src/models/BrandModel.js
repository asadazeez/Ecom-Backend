import mongoose from 'mongoose';



const brandSchema = new mongoose.Schema({
brandname : {
    type:String,
    required : true
},
description : {
    type:String,
    required:false
},
logo : {
    type:String,
    required:true
},
deletedAt : {
    type: Date,
    required:false
},


}, {timestamps:true});

export const BrandModel = mongoose.model('brands',brandSchema);