import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login(props) {
  const navigate = useNavigate();

  const Users = props.userList;
  console.log(Users);


  const [user, setUsers] = useState({
    email: '',
    password: '',

  });

  //בדיקת שגיאות
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleValidation = (name, isValid, errorMessage) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: isValid ? '' : errorMessage,
    }));
  };


 //ולידציה למייל
 const validateEmail = (e) => {
  const text = e.target.value;
  const regexEmail = /^[^\s@]+@[^\s@]+\.(?:com)$/;
  const isValid = regexEmail.test(text);
  handleValidation('email', isValid, 'follow the format abc@gmail.com abc@yahoo.com');
  if (isValid) {
      setUsers(prevUser => ({
          ...prevUser,
          email: text
      }));
  }
};

  //ולידציה לסיסמא
  const validatePassword = (e) => {
    const text = e.target.value;
    const regexPassworde = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>\/?]{7,12}$/;
    const isValid = regexPassworde.test(text);
    handleValidation('password', isValid, 'Invalid password! Password must contain between 7 and 12 characters, at least one special character, one uppercase letter, and one number.');
    if (isValid) {
      setUsers(prevUser => ({
        ...prevUser,
        password: text
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.email == "admin" && user.password == "ad12343211ad") {
      navigate('/SystemAdmin');
      return;
    }
    if (errors.email != "" || errors.password != "") {
      console.log("Cannot login Invalid email or password");

      return;
  
    }
    if (Users.length > 0) {

      let checkUser = Users.find(obj => obj.email === user.email && obj.password === user.password);
      if (checkUser) {
        console.log('Success');
        localStorage.setItem('users', JSON.stringify(checkUser));
        clearFields();
        navigate('/HomePage'); // להוסיף העברת הנתונים לדף בית 
        return ;

    
      }
      else {
        console.log('לא מצא משתמש כזה');
     
      }
    }
    else {
      console.log('אתה חייב להרשם קודם');
    
    }
  };
  const clearFields = () => {
    setUsers({ username: '', password: '' });

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue-500" >
      <div className="card w-96 bg-base-100 shadow-xl" style={{ backgroundColor: "#E4E9F2" }}>
        <div className="card-body text-center"> {/* Center text */}
          <div className="flex items-center justify-center">
            <div className="w-28 h-28"><img src="/public/login/spokenLogo.png" alt="Error" className="w-full h-full object-contain" /></div>
          </div>
          <form onSubmit={handleSubmit} >
            <div className="form-control" >
              <label className={`input input-bordered flex items-center gap-2 relative ${errors.email ? 'input-error' : ''}`} style={{ backgroundColor: "#E4E9F2", borderColor: '#070A40' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className={`grow ${errors.email ? 'input-error' : ''}`}
                  placeholder="Email"
                  onBlur={validateEmail}
                  aria-describedby={errors.email ? 'email-error' : ''}
                  value={user.email}
                  onChange={(e) => setUsers({ ...user, email: e.target.value })}
                  style={{ borderColor: errors.email ? '#e53e3e' : '' }}
                />
              </label>
              {errors.email && (
                <p id="email-error" className="text-red-500 mt-2">{errors.email}</p>
              )}
            </div>
            <br></br>
            <div className="form-control">
              <label className={`input input-bordered flex items-center gap-2 relative ${errors.password ? 'input-error' : ''}`} style={{ backgroundColor: "#E4E9F2", borderColor: '#070A40' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type="password"
                  className={`grow ${errors.password ? 'input-error' : ''}`}
                  placeholder='Password'
                  onBlur={validatePassword}
                  aria-describedby={errors.password ? 'password-error' : ''}
                  value={user.password}
                  onChange={(e) => setUsers({ ...user, password: e.target.value })}
                  style={{ borderColor: errors.password ? '#e53e3e' : '' }}

                />
              </label>
              {errors.password && (
                <p id="password-error" className="text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Forgot password button */}
            <div className="form-control">
              <button onClick={() => window.location.href = '/forgot-password'} style={{ color: "#2D4BA6", fontSize: '0.68rem', textDecoration: 'none', padding: '0.25rem 0.5rem' }} type="button"
                className="btn btn-link ml-auto text-sm">forgot your password?</button>
            </div>
            <div style={{ marginLeft: 'auto' }} className="form-control mt-6">
              <button
                onClick={() => navigate('/Register')} type="button"
                className="btn btn-link text-sm "
                style={{ backgroundColor: 'transparent', color: '#2D4BA6', textDecoration: 'none' }}
              >create account</button>
            </div>

            <div className="form-control mt-6">
              <button style={{ padding: '0.25rem 1rem', backgroundColor: '#070A40' }} type="submit"
                className="btn btn-xs sm:btn-sm  btn-primary">Login</button>
            </div>
            <div className="mt-10 mt-4 flex items-center justify-center">
              <div className="w-96 h-58"><img src="/public/login/LoginImage.png" alt="Error"
                className="w-full h-full object-contain" /></div>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default Login;
