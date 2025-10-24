import CartCard from "./CartCard";
export default function CartContainer({
  cart,
  AddQty,
  SubstractQty,
  RemoveItem,
  EmptyCart,
  total,
  itemsCount,
}) {
  const isEmpty = cart.length === 0; // just a flag that tells if the cart is empty so it can tell when to display "No items on the cart"

  return (
    <div className="CartContainer">
      <h2>Cart</h2>

      {isEmpty ? (
        <p>No items in the cart.</p> //this just displays the info on the cart
      ) : (
        <>
          <p>Items in cart: {itemsCount}</p> {/*the item count we made before*/}

          <div className="CartList">
            {cart.map((product) => (
              <CartCard
                key={product.id}
                item={product}
                Add={() => AddQty(product.id)} /*this just passes the functions as props*/
                Substract={() => SubstractQty(product.id)}
                removeFromCart={() => RemoveItem(product.id)}
              />
            ))}
          </div>

          <div className="CartListBtns" >
            <button className="RemoveButton" onClick={EmptyCart}>{/*button that empties the cart*/}
              Empty the cart u.u
            </button>
            <button id="BuyButton">
               :D Buy Total: ${total.toFixed(2)} {/*this is the fixed we used in the lecture to prevent the decimal number error*/}
            </button>
          </div>
        </>
      )}
    </div>
  );
}