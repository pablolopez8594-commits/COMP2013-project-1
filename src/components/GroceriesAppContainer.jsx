import { useState } from "react";
import products from "../data/products";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";

const parsePrice = (currentNumber) => Number(currentNumber.replace("$", "")); //this just removes the $ from the price atribute in the database
// I found about Number() at this website: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

export default function GroceriesAppContainer() {
  const [selectedQty, setSelectedQty] = useState(
    products.map((product) => ({ id: product.id, qty: 0 })) //this is an suestate that will change depending of the
    //users input
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
        (//                                    \|/ this right here is the one making sure of that
          product                   /////////   v
        ) => {//                                v
          //                                    v   this right here is the one making sure of that
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

    if (sel.qty === 0) {
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
          return { ...carProd, qty: carProd.qty + 1 };//
        } else {//                                         \\
          return carProd;//                                 \\
        }//                                                  \\
      })//                                                    \\
    );//                                                         this two are basically the same as inventory but for the cart
  };//                                                          //
//                                                             //
  const handleSubstractionCartQty = (productID) => {//        //
    setCart(//                                               //
      cart.map((carProd) => {//                             //
        if (carProd.id === productID && carProd.qty > 1) {//
          return { ...carProd, qty: carProd.qty - 1 };//
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
      <NavBar  username="Pablo" /> {/*this just passes the username value for the navBar*/}

      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={products}
          selectedQty={selectedQty}
          addQty={handlAddInventoryQty} // here we just pass the functions as props like we did in the lecture
          // for the prodcts container
          SubstractQty={handleSubstractionInventoryQty}
          AddToCart={handleAddToCart}
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
