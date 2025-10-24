import QuantityCounter from "./QuantityCounter";

export default function CartCard({ item, Add,Substract,removeFromCart }) {

  const subTotal = item.unitPrice * item.qty;{/*this is for getting the subtotal in the cart*/}

  return (
    <div className="CartCard">
      <img src={item.image} />  {/*the picture of the product on the card*/}
      <div className="CartCardInfo">{/*uses the css class*/}
        <h4>{item.productName}</h4> {/*name of the product*/}
        <p>Price: {item.price}</p>{/*price of the product*/}
        <p>Sub-total: ${subTotal.toFixed(2)}</p>
        <p>{item.qty}</p>

        <QuantityCounter add={Add} substract={Substract} /> {/*in cart adding and subtracting buttons*/}

        <button className="RemoveButton" onClick={removeFromCart}>{/*remove from cart button*/}
          Remove Item
        </button>
      </div>
    </div>
  );
}
//this section of the code is the code for each individual product card nin the cart