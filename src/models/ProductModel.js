import mongoose from 'mongoose';
// import slug from 'mongoose-slug-generator';
// mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      required: false,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    // slug: {
    //   type: String,
    //   slug: 'name',

    //   unique: true,
    //   slugPaddingSize: 3,
    // },
  },
  { timestamps: true }
);
export const ProductModel = mongoose.model('products', productSchema);