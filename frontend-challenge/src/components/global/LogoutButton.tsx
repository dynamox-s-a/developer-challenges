'use client'

import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import { Button } from '@mui/material'
import Logout from '@mui/icons-material/Logout'

export default function LogoutButton() {
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = () => {
        dispatch(logout())
        router.push('/login')
    }

    return (
        <Button color="error" endIcon={<Logout />} onClick={handleLogout}>
            Sair
        </Button>
    )
}
