import  {useState, useEffect} from 'react';
import axios from "axios";

function UserAPI(token) {

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if(token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/information', {
                        headers: {Authorization: token}
                    })

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
                    setCart(res.data.cart);

                } catch (error) {
                    alert(error.response.data.message);
                }
            }

            getUser();
        }
    }, [token])
    

    const addCard = async (product) => {
        if(!isLogged) return alert("Vous devez vous connecter pour continuer !");

        const check = cart.every(item => {
            return item._id !== product._id;
        })

        if(check) {
            setCart([...cart, {...product, quantity: 1}])

            await axios.patch('/user/addCart', {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {
                    Authorization: token}
            })
        } else {
            alert('produit ajouté au Panier')
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCard: addCard,
        history: [history, setHistory],
    }
}

export default UserAPI;
