import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const address = searchParams.get('address') ? JSON.parse(decodeURIComponent(searchParams.get('address'))) : null;
    const items = searchParams.get('items') ? JSON.parse(decodeURIComponent(searchParams.get('items'))) : null;
    const amount = searchParams.get('amount') ? Number(searchParams.get('amount')) : null;

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null
            }
            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe',
                { success, address, items, amount },
                { headers: { token } }
            )
            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token])

    return (
        <div></div>
    )
}

export default Verify