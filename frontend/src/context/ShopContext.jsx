import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const [currency, setCurrency] = useState('₹');
    const delivery_fee = 0;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    // Function to get price based on current currency
    const getPrice = (product) => {
        if (!product) return 0;
        return currency === '₹' ? product.priceINR : product.priceUSD;
    };

    // Function to toggle currency
    const toggleCurrency = () => {
        setCurrency(prev => prev === '₹' ? '$' : '₹');
    };

    const addToCart = async (itemId, size, color) => {
        const product = products.find(p => p._id === itemId);
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        if (product && product.colors && product.colors.length > 0 && !color) {
            toast.error('Select Product Color');
            return;
        }
        let cartData = structuredClone(cartItems);
        const key = color ? `${size}_${color}` : size;
        if (cartData[itemId]) {
            if (cartData[itemId][key]) {
                cartData[itemId][key] += 1;
            } else {
                cartData[itemId][key] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][key] = 1;
        }
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size, color }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, key, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][key] = quantity;
        setCartItems(cartData)
        if (token) {
            try {
                // Parse size and color from key
                let size = key;
                let color = undefined;
                if (key.includes('_')) {
                    [size, color] = key.split('_');
                }
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, color, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const key in cartItems[items]) {
                try {
                    if (cartItems[items][key] > 0) {
                        totalAmount += getPrice(itemInfo) * cartItems[items][key];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, getPrice, toggleCurrency
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;