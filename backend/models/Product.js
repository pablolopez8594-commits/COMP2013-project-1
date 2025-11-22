
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true }, //name of the product
  brand:      { type: String, required: true }, //brand
  image:      { type: String, required: true }, //the link to the image
  price:      { type: String, required: true }, // the price

});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
// this is the model we will use for products, its basically the blueprint for the database object, in this case we dont use id because mongo has a native id