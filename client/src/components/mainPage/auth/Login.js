import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import  axios from 'axios';


function Login() {

  const [user, setUser] = useState({email:'', password:''});

  const handleChange = e => {
    const {name, value} = e.target;
    setUser({...user, [name]:value});
  }

  const handleSubmit = async e => {
   e.preventDefault();

  try {
    await axios.post("/user/login", {...user});
    localStorage.setItem('firstLogin', true);
    window.location.href = "/";
      
  } catch (error) {
      alert(error.response.data.message);
    }

  }



  return (
    <div className='login-page'>
        <form onSubmit={handleSubmit}>
          <h2>Veuillez vous Connecter</h2>
          <input  type="email" 
                  name='email' 
                  required 
                  placeholder='Entrez votre email' 
                  value={user.email} 
                  onChange={handleChange} />

          <input  type="password"
                  name='password'
                  required
                  autoComplete='on'
                  placeholder='Entrez votre Mot de Passe'
                  value={user.password}
                  onChange={handleChange} />
          
          <div>
            <button type="submit">Connexion</button>
            <Link to="/register">S'inscrire</Link>
          </div>

        </form>
    </div>
  )
}

export default Login
