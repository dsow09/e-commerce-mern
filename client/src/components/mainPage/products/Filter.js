import React, {useContext} from 'react';
import {GlobalState} from "../../../GlobalState";

function Filter() {
    const state = useContext(GlobalState);
    const [categories] = state.categorieAPI.categories;

    const [category, setCategory] = state.productAPI.category;
    const [sort, setSort] = state.productAPI.sort;
    const [search, setSearch] = state.productAPI.search;

    const handleCategory = e => {
        setCategory(e.target.value);
        setSearch('');
    }

    return (
        <div className='filter_menu'>
            <div className='row'>
                <span>Filtrer : </span>
                <select name="category" value={category} onChange={handleCategory}>
                    <option value=''>Tous les Produits</option>
                    {
                        categories.map(category => (
                            <option value={"category="+category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            
            <input type="text" value={search} placeholder="Rechercher un produit"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className='row sort'>
                <span>Trier par : </span>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value=''>Les Plus récents</option>
                    <option value='sort=oldest'>Les Plus anciens</option>
                    <option value='sort=-sold'>les Meilleures ventes</option>
                    <option value='sort=-price'>Plus Chers</option>
                    <option value='sort=price'>Moins Chers</option>
                </select>
            </div>

        </div>
    )
}

export default Filter;
