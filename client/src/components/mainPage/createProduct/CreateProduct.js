import React, {useState, useContext, useEffect} from 'react';
import axios from "axios";
import {GlobalState} from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import {useNavigate, useParams} from "react-router-dom";

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: "",
    content: "",
    category: '',
    _id: ''
}


function CreateProduct() {
    const state = useContext(GlobalState);
    const [product, setProduct] = useState(initialState);
    const [categories] = state.categorieAPI.categories;
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    
    const navigate = useNavigate();
    const param = useParams();

    const [products] = state.productAPI.products;
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.productAPI.callback;


    useEffect(() => {
        if(param.id) {
            setOnEdit(true);
            products.forEach(product => {
                if(product._id === param.id) {
                    setProduct(product);
                    setImages(product.images);
                }
            })
           
        } else {
            setOnEdit(false);
            setProduct(initialState);
            setImages(false);
        }
    }, [param.id, products])

    const handleUpload = async e => {
        e.preventDefault();
        try {
            if(!isAdmin) alert('Vous n\'êtes pas Administrateur !')

            const file = e.target.files[0];
            if(!file) return alert("Fichier inexistant !")

            if(file.size > 1024*1024) return alert("La taille du fichier est trop grande !")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') return alert('Veuillez choisir un fichier de type JPEG ou PNG !')

            let formData = new FormData();
            formData.append('file', file);

            setLoading(true);
            const res = await axios.post('/api/upload', formData,{
                headers: {'content-type':'multipart/form-data', Authorization: token}
            })
            setLoading(false);
            setImages(res.data)

        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const handleDestroy = async () => {
        try {
            if(!isAdmin) return alert('Vous n\'êtes pas admin !');
            setLoading(true);
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })

            setLoading(false);
            setImages(false);

        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setProduct({...product, [name]: value});
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if(!isAdmin) return alert("Vous n'êtes pas admin !");
            if(!images) return alert("Aucune image sélectionnée !");

            if(onEdit) {
                await axios.put(`/api/products/${product._id}`, {...product, images}, {
                    headers: {Authorization: token}
                })    
            }
            else {
                await axios.post('/api/products', {...product, images}, {
                    headers: {Authorization: token}
                })    
            }
            setCallback(!callback);
            navigate('/');
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name='file' id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"><Loading /></div>
                    : 
                    <div id="file_img" style={styleUpload}>
                        <img  src={images ? images.url : ''} alt="" />
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
               
            </div>

            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <label htmlFor='product_id'>Id du Produit</label>
                    <input type="text" name='product_id' onChange={handleChangeInput} id="product_id" 
                    required value={product.product_id} disabled={onEdit}/>
                </div>

                <div className='row'>
                    <label htmlFor='title'>Titre</label>
                    <input type="text" name='title' onChange={handleChangeInput}
                    id="title" required value={product.title}/>
                </div>

                <div className='row'>
                    <label htmlFor='price'>prix du Produit</label>
                    <input type="number" name='price' onChange={handleChangeInput}
                    id="price" required value={product.price}/>
                </div>

                <div className='row'>
                    <label htmlFor='description'>Description du Produit</label>
                    <textarea type="text" name='description' onChange={handleChangeInput}
                    id="description" required value={product.description} rows="5" />
                </div>

                <div className='row'>
                    <label htmlFor='content'>Contenu</label>
                    <textarea type="text" name='content' onChange={handleChangeInput}
                    id="content" required value={product.content} rows="7 " />
                </div>

                <div className='row'>
                    <label htmlFor='categories'>Categorie</label>
                    <select name='category' value={product.category} 
                    onChange={handleChangeInput} >
                        <option value="">Veuillez choisir une Catégorie !</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit">{onEdit ? "Mettre à jour": "Créer"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
