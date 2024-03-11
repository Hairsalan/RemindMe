import { AuthContext } from "../context/AuthContext";
import { useContext } from 'react'

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('Uh oh. There seems to be an error.')
    }

    return context
}