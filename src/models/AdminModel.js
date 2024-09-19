import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required : true
},
deletedAt:{
    type:Date,
    required:false,
    deletedAt:null
}

    },
    {timestamps:true}
);
export const AdminModel = mongoose.model('admins',adminSchema);