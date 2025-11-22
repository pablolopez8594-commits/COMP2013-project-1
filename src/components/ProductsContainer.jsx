import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  selectedQty,
  addQty,
 SubstractQty,
 AddToCart,


//NEW STUFF YEEEEEEI
 /////////////////
   editItem,
  deleteProduct,
/////////////////

}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => {
        const state = selectedQty.find((currentProduct) => currentProduct.id === product.id) || { qty: 0 };
        //this just passes the qty of the product, or it passes 0 so it can display the warning
        return (
<ProductCard
  key={product._id}
       product={product}
  qty={state.qty}
  Add={() => addQty(product.id)}
  Substract={() => SubstractQty(product.id)}
    AddtoCart={() => AddToCart(product.id)}
  ///////////////
  editItemInDB={() => editItem(product._id)}       
  deleteItemFromDB={() => deleteProduct(product._id)}
//////////////////////////////

/>
        );
      })}
    </div>
  );
}