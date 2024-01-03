// Login.js
import { useState } from 'react';
import './Login.css'; // Import the CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './components/Authcontext';
function Login  () {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const {Login}  = useAuth();
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/login', {username, password})
    .then(result => {console.log(result)
        if(result.data === "Succes"){
        navigate('/Song')
        }
    })
    .catch(err => console.log(err))
    
    if (username && password) {
    
    
        Login(username);
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Groovin</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Groovin</button>
      </div>
    </div>
  );
}

export default Login;
