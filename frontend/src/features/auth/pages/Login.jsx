import {useState} from 'react'
import '../auth.form.scss'
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError('')
    try {
      await handleLogin({ email, password })
      navigate('/')
    } catch (err) {
      setError('Invalid email or password.')
    }
  }

  if (loading){
    return (<main><h2>Loading...</h2></main>)
  }

  return (
    <main>
      <div className="login-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form action="" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
              {showPassword ? <EyeOff className="toggle-icon" onClick={() => setShowPassword(false)} size={18} /> : <Eye className="toggle-icon" onClick={() => setShowPassword(true)} size={18} />}
            </div>
          </div>
          <button type="submit" className="btn primary-btn">Login</button>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </main>
  )
}

export default Login
