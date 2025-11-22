import { useState, useEffect } from "react";              
import axios from "axios";                                
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import ProductForm from "./ProductForm";                  // this is the form :D

const API_URL = "http://localhost:3000/api/products"; //backend that contains the backend url

const parsePrice = (currentNumber) => Number(currentNumber.replace("$", "")); //this just removes the $ from the price atribute in the database
// I found about Number() at this website: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

export default function GroceriesAppContainer() {
  const [products, mongoProducts] = useState([]);

// the all migthy form usestate
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",     // react need us to incialize the values to empty string
    image: "",
    price: "",
  });

  const [editingMongoId, setEditingMongoId] = useState(null); // this is very important, is used to save the _id of the product we are editing
  const [postResponse, setPostResponse] = useState(null); //the messenger, either it success or it fails

//quantity for the cart
  const [selectedQty, setSelectedQty] = useState(
    [] 
  );

  //we make the dinamic cart that will be usefull later
  const [cart, setCart] = useState([]);

  // this 2 variables help us calculate the total for the cart and the amount of items
  let cartUnits = 0;
  let cartTotal = 0;

  cart.forEach((item) => {
    cartUnits += item.qty; // here is the amount of items
    cartTotal += item.qty * item.unitPrice; //here gets the proce for all items
  });

//gets the products from mongoooooooo
  const fetchProducts = async () => { //gets products from the mongo
    try {
      const response = await axios.get(API_URL); // here we "call" the back end
      const data = response.data; // stores the result in a variable, is an array

      mongoProducts(data);


      setSelectedQty(data.map((product) => ({ id: product.id, qty: 0 }))); //this is very important, because we generate a smaller object, with the id and qty
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();//makes all the magic happen
  }, []);//this tiny thing makes that it executes one time only at the beiginning, otherwise the app would break

//new item added (duckies only)

  const handleFormChange = (inputEvent) => {
    const { name, value } = inputEvent.target; //this is 
 //                                             the input that triggers the event could be name, brand etc etc.
    setFormData((prev) => ({    
      ...prev, // copies all thats in the form
      [name]: value,
    }));
  };

  const handleFormSubmit = async (formSubmit) => {
    formSubmit.preventDefault(); //prevents the form to refresh the page

    try {
      let response; //we save the back end response here
      if (editingMongoId) {
        //if the product alredy exists, it just modifues, it uses the id to tell if it exists
        response = await axios.patch(`${API_URL}/${editingMongoId}`, formData);
      } else {
        // if the product id doesnt exist it creates a new 
        response = await axios.post(API_URL, formData);
      }

      setPostResponse(response.data); //the success or not message

      await fetchProducts();// ask for all products again

      //this cleans the form for new input, niceeee
      setFormData({
        id: "",
        productName: "",
        brand: "",
        image: "",
        price: "",
        quantity: "",
      });
      setEditingMongoId(null); // this is very important, took me a lot to realize that it was very important to get out of the editing mode if we wanted to add a new product or else
    } catch (error) {
      console.log(error.message);//just error message
    }
  };

  const editItem = async (mongoId) => { //the id of the product we want to edit
    try {
      const response = await axios.get(`${API_URL}/${mongoId}`);//this gets the full product
      const productToEdit = response.data;

      setFormData({
        id: productToEdit.id,
        productName: productToEdit.productName,
        brand: productToEdit.brand,
        image: productToEdit.image,  // this fills the form with the information from productToEdit
        price: productToEdit.price,
        quantity: productToEdit.quantity,
      });

      setEditingMongoId(productToEdit._id); // saves the _id
      setPostResponse(null); // again, this is important if we want to clean all after editing
    } catch (error) {
      console.log(error.message); //error message, if something goes wrong
    }
  };

  const deleteProduct = async (mongoId) => {// same, gets the id of the product we want to delete
  try {
  const response = await axios.delete(`${API_URL}/${mongoId}`); // backend deletes the product
  setPostResponse(response.data);

  // we update the list of products, we put all of them except for the one we just deleted
  mongoProducts((prev) => prev.filter((p) => p._id !== mongoId));

//here we just make sure to not leave garbage info, in this case is the qty
  setSelectedQty((prev) => prev.filter((q) => q.id !== mongoId));
} catch (error) {
  console.log(error.message); //error mesage
}
  };
// cart original code /////////////////////////////////////////////////////////////////////////

  const handlAddInventoryQty = (productID) => {
    setSelectedQty(
      selectedQty.map((primalProduct) => {
        if (primalProduct.id === productID) {
          return { ...primalProduct, qty: primalProduct.qty + 1 };
        } else {
          return primalProduct;
        }
      })
    );
  };

  const handleSubstractionInventoryQty = (productID) => {
    // this functions habdles substraction, it also makes sure the selection goes bellow 0
    setSelectedQty(
      //
      selectedQty.map(
        //
        (product) => {
          if (product.id === productID && product.qty > 0) {
            return { ...product, qty: product.qty - 1 };
          } else {
            return product;
          }
        }
      )
    );
  };

  const handleAddToCart = (productID) => {
    // this justs adds to cart
    const currentProduct = products.find(
      (primalProducts) => primalProducts.id === productID //current product Id
    );
    const sel = selectedQty.find(
      (qtySelectedBytheUser) => qtySelectedBytheUser.id === productID //CurrentProduct qty
    );

    if (!sel || sel.qty === 0) {
      alert("Please add quantity before adding to cart"); // of the user doesnt select qty a warning is shown
      return;
    }

    const unitPrice = parsePrice(currentProduct.price); //This parses the price to a number
    const exists = cart.find(
      // this is just a boolean flag that tell us if the item is alredy in the cart :)
      (alredyInTheCart) => alredyInTheCart.id === productID
    );

    if (exists) {
      // If item exists it adds the qty, otherwise just returns the product as it is
      setCart(
        cart.map((carProd) => {
          if (carProd.id === productID) {
            return { ...carProd, qty: carProd.qty + sel.qty };
          } else {
            return carProd;
          }
        })
      );
    } else {
      // if the product is not in the cart it passes the whole thing to the cart array
      setCart([
        ...cart,
        {
          id: currentProduct.id,
          productName: currentProduct.productName,
          image: currentProduct.image,
          unitPrice,
          price: currentProduct.price,
          qty: sel.qty,
        },
      ]);
    }
  };

  const handleAddCartQty = (productID) => {
    setCart(
      cart.map((carProd) => {
        if (carProd.id === productID) {
          return { ...carProd, qty: carProd.qty + 1 }; //
        } else {
          //                                         \\
          return carProd; //                                 \\
        } //                                                  \\
      }) //                                                    \\
    ); //                                                         this two are basically the same as inventory but for the cart
  }; //                                                          //
//                                                             //
  const handleSubstractionCartQty = (productID) => {
    //        //
    setCart(
      //
      cart.map((carProd) => {
        //
        if (carProd.id === productID && carProd.qty > 1) {
          //
          return { ...carProd, qty: carProd.qty - 1 }; //
        } else {
          return carProd;
        }
      })
    );
  };

  const handleDeleteFromCart = (productID) => {
    setCart(cart.filter((carProd) => carProd.id !== productID));
    //this jus basically creates a new array of cart that includes all ids except for the one we want to remove
    //thats why we have carProd.id !== productID is just a way to filter.
  };
  // this just restores an empty array in cart
  const handleEmptyCart = () => setCart([]);

  return (
    <div className="GroceriesApp">
      <NavBar username="Pablo" /> {/*this just passes the username value for the navBar*/}

      <div className="GroceriesApp-Container">
       
        <div className="ProductFormPanel">
          <ProductForm
            formData={formData}
            changeItem={handleFormChange}     // new
            submitValues={handleFormSubmit}   // new
          />
          <p style={{ color: "green" }}>{postResponse?.message}</p>
        </div>

        <ProductsContainer
          products={products}
          selectedQty={selectedQty}
          addQty={handlAddInventoryQty} // here we just pass the functions as props like we did in the lecture
          // for the prodcts container
          SubstractQty={handleSubstractionInventoryQty}
          AddToCart={handleAddToCart}
          editItem={editItem}           // new
          deleteProduct={deleteProduct} // new
        />

        <CartContainer
          cart={cart}
          AddQty={handleAddCartQty}
          SubstractQty={handleSubstractionCartQty} // same thing but for cart container :D
          RemoveItem={handleDeleteFromCart}
          EmptyCart={handleEmptyCart}
          total={cartTotal}
          itemsCount={cartUnits}
        />
      </div>
    </div>
  );
}
