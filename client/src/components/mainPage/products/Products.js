import React, {useContext, useState} from 'react';
import {GlobalState} from "../../../GlobalState";
import Loading from '../utils/loading/Loading';
import ProductItem from '../utils/productItem/ProductItem';
import axios from "axios";
import Filter from './Filter';
import LoadMore from './LoadMore';

function Products() {

  const state = useContext(GlobalState);
  const [products, setProducts] = state.productAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const deleteProduct = async(id, public_id) => {
    console.log({id, public_id})
    try {
        setLoading(true);
        const destroyImg = await axios.post('/api/destroy', {public_id},{
          headers: {Authorization: token}
        })

        const deleteProduct = await axios.delete(`/api/products/${id}`, {
          headers: {Authorization: token}
        })

        await destroyImg;
        await deleteProduct;
        setCallback(!callback);
        setLoading(false);
        
    } catch (error) {
      alert(error.response.data.message);
    }
  }

    const handleCheck = (id) => {
      products.forEach(product => {
        if(product._id === id) product.checked = !product.checked;
      })

      setProducts([...products]);
    }

    const checkAll = () => {
      products.forEach(product => {
        product.checked = !isCheck;
      })
      setProducts([...products]);
      setIsCheck(!isCheck)
    }

    const deleteAll = () => {
      products.forEach(product => {
        if(product.checked) deleteProduct(product._id, product.images.public_id)
      })
    }

    if(loading) return <div><Loading/></div>


  return (
      <>
        <Filter/>
        {
          isAdmin && 
          <div className="delete-all">
            <span>Sélectionner Tout</span>
            <input type="checkbox" checked={isCheck} onChange={checkAll} />
            <button onClick={deleteAll}>Supprimer Tout</button>
          </div>
        }

        <div className='product'>
          {
            products.map(product => {
              return <ProductItem key={product._id} product={product} setProducts={setProducts} 
              isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck}/>
            })
          }
        </div>

        <LoadMore/>
        {products.length === 0 && <Loading />}
      </>
  )
}

export default Products