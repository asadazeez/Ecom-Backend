import mongoose from 'mongoose';



const categorySchema = new mongoose.Schema({
categoryname : {
    type:String,
    required : true
},
description : {
    type:String,
    required:true
},
image : {
    type:String,
    required:false
},
deletedAt : {
    type: Date,
    required:false
},


}, {timestamps:true});

export const CategoryModel = mongoose.model('categories',categorySchema);