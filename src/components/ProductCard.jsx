import QuantityCounter from "./QuantityCounter";

export default function ProductCard({ product, qty, Add, Substract,AddtoCart }) {

  return (
    <div className="ProductCard">
      <img src={product.image} />
      <h3>{product.productName}</h3>
      <p>Brand: {product.brand}</p> {/*displays the info of the objects in tags*/}
    <p>Quantity: {product.quantity}</p>
      <p>Price: {product.price}</p>
      <p>{qty}</p>

      <QuantityCounter
        add={Add}
        substract={Substract} /*passes the functions to add and substract to the Quantity counter*/
      />

      <button onClick={AddtoCart}>Add to Cart</button> {/*Add to cart button :D*/}
    </div>
  );
}