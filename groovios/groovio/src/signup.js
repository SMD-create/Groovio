import React from 'react';
import './Signup.css';


function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" />
          </div>
          <div class="form-group">
  <label>Gender</label>
  <div class="gender-radio">
    <input type="radio" id="male" name="gender" value="male" />
    <label for="male">Male</label>
    
    <input type="radio" id="female" name="gender" value="female" />
    <label for="female">Female</label>
    
    <label for="other">Other</label>
    <input type="radio" id="other" name="gender" value="other" />
  </div>
</div>
                  
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
