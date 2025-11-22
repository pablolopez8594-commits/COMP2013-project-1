export default function ProductForm({ formData, changeItem, submitValues }) {
  return (
    <form onSubmit={submitValues} className="ProductForm">
      <h3>ITEM FORM</h3>


      <input
      // this handles the users input for:
        type="text"
        name="productName"
        placeholder="Product Name"
        value={formData.productName} //     NAME
        onChange={changeItem}
        required
      />

      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={formData.brand}//     BRAND
        onChange={changeItem}
        required
      />

      <input
        type="text"
        name="image"
        placeholder="Image URL"//     IMAGE
        value={formData.image}
        onChange={changeItem}
        required
      />

      <input
        type="text"
        name="price"
        placeholder="Price (e.g. $3.99)" //     PRICE
        value={formData.price}
        onChange={changeItem}
        required
      />

      <button type="submit"
      //     Submit button
      >Submit</button> 
    </form>
  );
}