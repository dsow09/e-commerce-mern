import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {GlobalState} from "../../../../GlobalState";


function BoutonRender({product, deleteProduct}) {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCard = state.userAPI.addCard;

  return (
    <div className='row_btn'>
      {
        isAdmin ?
        <>
          <Link to="#!" id='btn_buy' 
          onClick={() => deleteProduct(product._id, product.images.public_id)}>
            Supprimer
          </Link>
          <Link to={`/edit_product/${product._id}`} id='btn_view'>
            Modifier
          </Link>
        </>
        : <>
            <Link to="#!" id='btn_buy' onClick={() => addCard(product)}>
              Acheter
            </Link>
            <Link to={`/detail/${product._id}`} id='btn_view'>
              Voir Plus
            </Link>
          </>
      }
        
    </div>
  )
}

export default BoutonRender
