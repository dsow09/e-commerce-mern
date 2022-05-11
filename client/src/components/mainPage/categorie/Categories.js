import React, {useState, useContext} from 'react';
import {GlobalState} from "../../../GlobalState";
import axios from "axios";

function Categories() {
    const state = useContext(GlobalState);
    const [categories] = state.categorieAPI.categories;
    const [category, setCategory] = useState('');
    const [token] = state.token;
    const [callback, setCallback] = state.categorieAPI.callback;
    const [onEdit, setOnEdit] = useState(false);
    const [id, setId] = useState('');

    const CreateCategories = async(e) => {
        e.preventDefault();
        try {
            if(onEdit) {
                const res = await axios.put(`/api/category/${id}`, {name: category}, {
                    headers: {Authorization: token}
                })
                
                alert(res.data.Message);

            }else {
                const res = await axios.post('/api/category', {name: category}, {
                    headers: {Authorization: token}
                })

                alert(res.data.Message);
            }
            setOnEdit(false);
            setCategory('');
            setCallback(!callback);

        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const editCategory = async (id, name) => {
        setId(id);
        setCategory(name);
        setOnEdit(true);
    }

    const deleteCategory = async (id) => {
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: {
                    Authorization: token}
            })
            
            alert(res.data.Message);
            setCallback(!callback);
        } catch (error) {
            alert(error.response.data.Message);
        }
    }


    return (
        <div className='categories'>
            <form onSubmit={CreateCategories}>
                <label htmlFor='category'>Categorie</label>
                <input type="text" name='category' value={category} required 
                onChange={e=>setCategory(e.target.value)}/>
                <button type="submit">{onEdit ? "Mettre à jour" : "Créer"}</button>
            </form>

            <div className='col'>
                <h2>Liste des Catégories</h2>
                {
                    categories.map(category=>(
                        <div className='row' key={category._id}>
                            <p>{category.name}</p>
                            <div>
                                <button onClick={() => editCategory(category._id, category.name)}>Modifier</button>
                                <button onClick={() => deleteCategory(category._id)}>Supprimer</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories
