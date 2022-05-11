import React, {createContext, useState, useEffect} from "react";
import ProductAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import axios from "axios";
import CategorieAPI from "./api/CategorieAPI";

export const GlobalState = createContext();

export const DataProvider = ({children}) => {
    const [token, setToken] = useState(false);

    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin');
        if(firstLogin) {
            const refreshToken = async () => {
                const res = await axios.get('/user/refresh_token');

                setToken(res.data.accesstoken);

                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken();
        }
    }, [])

    const state = {
        token: [token, setToken],
        productAPI:  ProductAPI(),
        userAPI: UserAPI(token),
        categorieAPI: CategorieAPI()
    }
   
    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}