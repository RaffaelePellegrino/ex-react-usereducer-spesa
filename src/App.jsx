import { useEffect,useReducer } from "react";

const initialCart = [];

function cartReducer(cartState, action) {
  switch (action.type) {

    case 'ADD_PRODUCT': {
      const foundProduct = cartState.find(product => product.name === action.payload.name);

      if (foundProduct) {
        return cartState.map(product => {
          if (product.name === action.payload.name) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            return product;
          }
        });
      } else {
        return [...cartState, { ...action.payload, quantity: 1 }];
      }
    }

    case 'REMOVE_PRODUCT': {
      return cartState.filter(product => product.name !== action.payload.name);
    }

    case 'CHANGE_QUANTITY': {
      const newQuantity = parseInt(action.payload.quantity);

      if (isNaN(newQuantity) || newQuantity < 1) {
        return cartState;
      }

      return cartState.map(product => {
        if (product.name === action.payload.name) {
          return { ...product, quantity: newQuantity };
        } else {
          return product;
        }
      });
    }

    default:
      return cartState;
  }
}

function App() {
  const availableProducts = [
    { name: 'Biscotti', price: 1.5 },
    { name: 'Latte', price: 1.2 },
    { name: 'Acqua', price: 0.5 },
    { name: 'Uova', price: 2.0 },
  ];

  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  function addProductToCart(product) {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  }

  function removeProductFromCart(productName) {
    dispatch({ type: 'REMOVE_PRODUCT', payload: { name: productName } });
  }

  function changeProductQuantity(productName, newQuantity) {
    dispatch({
      type: 'CHANGE_QUANTITY',
      payload: { name: productName, quantity: newQuantity },
    });
  }

  function calculateTotalPrice() {
    return cart
      .reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0)
      .toFixed(2);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>La mia lista della spesa</h1>

      <h2>Prodotti disponibili</h2>
      <ul>
        {availableProducts.map((product, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            {product.name} - €{product.price.toFixed(2)}{" "}
            <button onClick={() => addProductToCart(product)}>
              Aggiungi
            </button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div>
          <h2>Carrello</h2>
          <ul>
            {cart.map((product, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {product.name} - €{product.price.toFixed(2)} x{" "}
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  onChange={(e) =>
                    changeProductQuantity(product.name, e.target.value)
                  }
                  style={{ width: '50px', marginRight: '10px' }}
                />
                <button onClick={() => removeProductFromCart(product.name)}>
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>

          <h3>Totale: ${calculateTotalPrice()}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
