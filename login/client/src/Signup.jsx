import {useState} from 'react';
import './Signup.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
    const [username, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [dob, setDob] = useState()
    const [Gender, setGender] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', {username, email, password, dob, Gender})
        .then(result => {console.log(result)
        navigate('/login')
        })
        .catch(err=> console.log(err))
    }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <div className="login-link">
        <p>
          Already have an account? <Link to="./Login"><button>Groovin</button></Link>
        </p>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="form-group">
  <label>Gender</label>
  <div className="gender-radio">
    <hr/>
    <label htmlFor="male">Male</label><input type="radio" id="male" name="gender" value="male" onChange={(e) => setGender(e.target.value)}/>
    <label htmlFor="female">Female</label>
    <input type="radio" id="female" name="gender" value="female" onChange={(e) => setGender(e.target.value)}/>
    <label htmlFor="other">Other</label>
    <input type="radio" id="other" name="gender" value="other" onChange={(e) => setGender(e.target.value)}/>
    <hr/>
  </div>
</div>
                  
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
