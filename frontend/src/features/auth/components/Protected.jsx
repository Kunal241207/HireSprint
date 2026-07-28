import {useAuth} from '../hooks/useAuth'
import { Navigate } from 'react-router'

export default function Protected({children}) {
  const {loading, user} = useAuth()
  if (loading){
    return (<main><h2>Loading...</h2></main>)
  }
  if (!user) {
    return <Navigate to={'/login'} />
  }
  return (
    children
  )
}
