export default function QuantityCounter({ add, substract }) {
  return (
    <div className="counter-container">
      <button className="counter-button" onClick={substract}>
        - {/*just the substracting character fot the button*/}
      </button>

      <button className="counter-button" onClick={add}>
        +  {/* just the adding simbol*/}
      </button>
    </div>
  );
}
//This section of the code is basically a reusable quantity counter, it assigns functions
//to a couple of buttons, its a reusable comonent that is used in CartCard and ProductCard
