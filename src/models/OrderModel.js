import mongoose from 'mongoose';
import AutoIncreamentInc from 'mongoose-sequence';
const AutoIncreament = AutoIncreamentInc(mongoose);

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    required: false,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },
    },
  ],
total:{
    type:Number,
    required:true
},
grandTotal:{
    type:Number,
    require:true
},
shippingTotal:{
    type:Number,
    required:true
},
billingDetails:{
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:Number,
    required:false
  },
  country:{
    type:String,
    required:true
  },
  pinCode:{
    type:Number,
    required:true
  }
},
deletedAt:{
    type:Date,
    required:false
}

},
{timestamps:true});
orderSchema.plugin(AutoIncreament , {
    inc_field:'orderNumber',
    startAt:1

});



export const OrderModel = mongoose.model('orders',orderSchema);