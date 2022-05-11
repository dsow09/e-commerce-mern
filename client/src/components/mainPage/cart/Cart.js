import React, {useContext, useState, useEffect} from 'react';
import {GlobalState} from "../../../GlobalState";
import axios from "axios";
import PaypalButton from "./PaypalButton";

function Cart () {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  //const [callback, setCallback] = state.userAPI.callback;
  
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      }, 0)

      setTotal(total);
    }
    getTotal();
  }, [cart])

  const addToCart = async(cart) => {
    await axios.patch('/user/addcart', {cart},  {
        headers: {
          Authorization: token
          //'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmIxNTI0MWM0MzM0ZDdhMzhiZDk3NyIsImlhdCI6MTY1MjAxNjM5MywiZXhwIjoxNjUyMTg5MTkzfQ.d7T-Os2sZF2RGuGojuFGUe6mu0c2Wy0wj6GtFdqEY94'
        }
    })
  }

  const increment = (id) => {
    cart.forEach(item => {
      if(item._id === id) {
        item.quantity += 1;
      }
    })
    setCart([...cart]);
    addToCart(cart);
  }

  const decrement = (id) => {
    cart.forEach(item => {
      if(item._id === id) {
        item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1;
      }
    })
    setCart([...cart]);
    addToCart(cart);
  }

  const removeProduct = id => {
    if(window.confirm("Voulez vous supprimer ce produit ?")) {
      cart.forEach((item, index) => {
        if(item._id === id) {
          cart.splice(index, 1)
        }
      })
      setCart([...cart]);
      addToCart(cart);
    }
  }

  const tranSuccess = async(payement) => {
    const {paymentID, address} = payement;

    await axios.post('/api/payement', {cart, paymentID, address}, {
      headers: {
        Authorization: token
        //'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmIxNTI0MWM0MzM0ZDdhMzhiZDk3NyIsImlhdCI6MTY1MjAxNjM5MywiZXhwIjoxNjUyMTg5MTkzfQ.d7T-Os2sZF2RGuGojuFGUe6mu0c2Wy0wj6GtFdqEY94'
      }
    })
    setCart([]);
    addToCart([]);
    alert('Vous avez passé votre commande avec succès !');
    //setCallback(!callback)
  }

  if(cart.length === 0) 
    return <h2 style={{textAlign: "center", color: "red"}}>Votre Panier est vide !</h2>


  return (
      <div>
        {
          cart.map(product => (
              <div className='detail cart' key={product._id}>
                <img src={product.images.url} alt="product_img"  />
                <div className="box-detail">
                    <h2>{product.title}</h2>

                    <h3>{product.price * product.quantity} FCFA</h3>
                    <p>{product.description}</p>
                    <p>{product.content}</p>

                    <div className='amount'>
                      <button onClick={() => decrement(product._id)}> - </button>
                      <span>{product.quantity}</span>
                      <button onClick={() => increment(product._id)}> + </button>
                    </div>

                    <div className='delete' onClick={() => removeProduct(product._id)} >X</div>

                </div>
              </div>
          ))
        }
        <div className='total'>
          <h3>Total: {total} FCFA </h3>
          <PaypalButton 
          total={total}
          tranSuccess={tranSuccess}/>
        </div>
      </div>
  )
}

export default Cart;