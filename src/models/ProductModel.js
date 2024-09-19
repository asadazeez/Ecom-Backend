import mongoose  from 'mongoose';

const productSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required: true
    },
    brand:{
        type:mongoose.Types.ObjectId,
        required:false
    },
    category:{
        type:mongoose.Types.ObjectId,
        required:false
    },
    price:{
        type:Number,
        required:true
    },
    deletedAt:{
        type:Date,
        default:null,
        required:false

    },
    featured:{
        type : Boolean,
        required:true,
        default:false,
    }

},
{timestamps:true}




);
export const ProductModel = mongoose.model('products', productSchema);