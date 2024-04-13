import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Info', { username, password });
    // Implement your login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
  <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body text-center"> {/* Center text */}
      {/* Space on the upper part for logo */}
      <div className="mb-4"> {/* Adjust margin as needed for your logo */}
        {/* Placeholder for logo, replace with your <img> or component */}
        <div className="h-20">Logo Space</div>
      </div>

      <h2 className="card-title text-dark-blue-500">Login</h2> {/* Text color */}
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label" htmlFor="username">
            <span className="label-text text-dark-blue-500">Username</span>
          </label>
          <input type="text" placeholder="Username" id="username"
                 className="input input-bordered" value={username}
                 onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text text-dark-blue-500">Password</span>
          </label>
          <input type="password" placeholder="Password" id="password"
                 className="input input-bordered" value={password}
                 onChange={(e) => setPassword(e.target.value)} />
        </div>
        


        {/* Forgot password button */}
        <div className="form-control">
          <button onClick={() => window.location.href='/forgot-password'} type="button" className="btn btn-link">Forgot my password</button>
        </div>

        <div className="form-control mt-4">
          <button type="submit" className="btn bg-dark-blue-500 hover:bg-dark-blue-700 text-white">Login</button>
        </div>
                {/* Register button */}
                <div className="form-control mt-4">
          <button onClick={() => window.location.href='/register'} type="button" className="btn btn-outline btn-accent">Register</button>
        </div>
        {/* Space for picture under the login button */}
        <div className="mt-4"> {/* Adjust margin as needed for your picture */}
          {/* Placeholder for picture, replace with your <img> or component */}
          <div className="h-20">Picture Space</div>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}

export default Login;
