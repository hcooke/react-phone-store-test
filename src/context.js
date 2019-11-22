import React, { useEffect, useReducer } from 'react';
import { storeProducts, detailProduct } from "./data";
console.log("context");

const ProductContext = React.createContext();

function ProductProvider(props) {

  const initialState={
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };

  const [state, dispatch] = useReducer((state, newState) => ({...state, ...newState}), initialState);

  useEffect(() => {
    const setProduct = () => {

      let tempProducts = [];
      storeProducts.forEach(item => {
        const singleItem = { ...item };
        tempProducts = [...tempProducts, singleItem];
      });

      dispatch({
        products: tempProducts, 
        // detailProduct: detailProduct,
        // cart: tempCart,
        // modalOpen: false,
        // modalProduct: detailProduct
      });
    };

    setProduct();
  }, []);

  const getItem = (id) => {
    const product = state.products.find(item => item.id ===id);
    return product;
  }

  const handleDetail = (id) => {
    const product = getItem(id);
 
    dispatch({
      // products: storeProducts,
      products: [...state.products],
      detailProduct: product
    });
  };

  const addToCart = (id) => {
    let tempProducts = [...state.products];
    const index = tempProducts.indexOf(getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    dispatch({
      products: tempProducts, 
      cart: [...state.cart, product]
    });
  };

  const openModal = (id) => {
    const product = getItem(id);

    dispatch({
      modalProduct: product,
      modalOpen: true
    });

  };

  const closeModal = () => {
    dispatch({
      modalOpen: false
    });
  };

  const increment = (id) => {
    let tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id ===id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count + 1;
    product.total = product.count * product.price;

    dispatch({
      cart: [...tempCart]
    });
    addTotals();
  };

  const decrement = (id) => {
    let tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id ===id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count - 1;

    if(product.count === 0){
      removeItem(id)
    } else {
      product.total = product.count * product.price;

      dispatch({
        cart: [...tempCart]
      });
      addTotals();
    }
  };

  const removeItem = (id) => {
    let tempProducts = [...state.products];
    let tempCart = [...state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    dispatch({
      cart: [...tempCart],
      products: [...tempProducts]
    });

    addTotals();
  };

  const clearCart = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });

    dispatch({
      products: tempProducts, 
      cart: []
    });

    addTotals();
  };

  const addTotals = () => {
    let subTotal = 0;
    state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;

    dispatch({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    });
  };

  useEffect(() => {
    addTotals();
    // eslint-disable-next-line
  }, [state.products, state.cart]);
  
  return (
    
    <ProductContext.Provider value={{
      ...state,
      handleDetail: handleDetail,
      addToCart: addToCart,
      openModal: openModal,
      closeModal: closeModal,
      increment: increment,
      decrement: decrement,
      removeItem: removeItem,
      clearCart: clearCart
    }}>
      {props.children}
    </ProductContext.Provider>
  );
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };