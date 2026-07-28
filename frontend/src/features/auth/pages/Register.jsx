import {useState} from 'react'
import {useNavigate, Link} from 'react-router'
import {useAuth} from '../hooks/useAuth'
import {Eye, EyeOff} from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()  

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError('')
    try{
      await handleRegister({username, email, password})
      navigate('/')
    }catch(err){
      setError('Registration failed.')
    }
  }

    if (loading){
        return (<main><h2>Loading...</h2></main>)
    }

  return (
    <main>
        <div className="login-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            <form action="" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                      <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      {showPassword ? <EyeOff className="toggle-icon" onClick={() => setShowPassword(false)} size={18} /> : <Eye className="toggle-icon" onClick={() => setShowPassword(true)} size={18} />}
                    </div>
                </div>
                <button type="submit" className="btn primary-btn">Register</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    </main>
  )
}

export default Register
