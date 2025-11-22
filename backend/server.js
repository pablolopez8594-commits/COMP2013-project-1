//Initializing Server
const express = require("express");
const server = express();
const port = 3000;

const mongoose = require("mongoose");// import mongoose
require("dotenv").config();// import dotenv
const { MONGO_URI } = process.env; // to grab the same variable from the dotenv file
const cors = require("cors");// For disabling default browser security

// Importing the model schema
const Product = require("./models/Product");

//Middleware
server.use(express.json());// to ensure data is transmitted as json
server.use(express.urlencoded({ extended: true })); // to ensure data is encoded and decoded while transmission
server.use(cors());

// this basically gets the info from products, the mongo database
server.get("/api/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
server.get("/api/products/:id", async (request, response) => {
  const { id } = request.params; //takes the id of the product we want to get

  try {
    const productToEdit = await Product.findById(id); //finds the product by the id
    response.send(productToEdit);//sends back the requested product
  } catch (error) {
    response.status(500).send({ message: error.message }); //error message if the process fails
  }
});

//this section is when posting a new product (I HAD TO DELETE id_1 FROM MONGO COMPASS THIS IS THE REASON I SUBMITTED THAT LATE  AAAAAAA)
server.post("/api/products", async (request, response) => { //this is like saying, when someone wants to add a new product

  const { productName, brand, image, price } = request.body; //requirements for the new product to be added

  const newProduct = new Product({
    productName,
    brand,
    image,
    price,
  });

  try {
    await newProduct.save();
    response.status(200).send({ message: "Product is added successfully!" }); //if it was succesfull it shows this message
  } catch (error) {
        console.log("YOU DIDNT SAY THE MAGIC WORD", error); //This was hard to find, I found it in the bloody terminal powershell
        //not no mentioon the browser terminal >:(
    response.status(400).send({ message: error.message });
  }
});

// when modifying a product
server.patch("/api/products/:id", async (request, response) => { //PATCH is used to modify existing info
  const { id } = request.params; //here we get the url
  const { productName, brand, image, price } = request.body;// new values

  try {
    await Product.findByIdAndUpdate(id, {//finds the product with _id that matches with the id
      productName,
      brand,
      image, //updates this fields
      price,
    });

    response.send({ message: `Product has been updated with the id ${id}` }); //this sends the 
    // yeeei we did it message to the user, followed by the id of the product that has been changed
  } catch (error) {
    response.status(500).send({ message: error.message }); //error message
  }
});


server.delete("/api/products/:id", async (request, response) => {
  const { id } = request.params; //same idea, we get the product by the id.

  try {
    await Product.findByIdAndDelete(id); //this time, we use this function to delete the object
    response.send({ message: "Product is deleted!" }); //delete success message
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//this takes care of the conection with database, including a couple of console messages as confirmation in the console.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(
        `Database is connected\nServer is listening on ${port}`
      );
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error); //luckyly I never had this in my console
  });
