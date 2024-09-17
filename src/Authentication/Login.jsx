import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Reuse the same CSS file
import { getAllUsers } from '../Admin/firebase/userApi';

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  let [userdata, setuserdata] = useState([]);

  // Handle login
  console.log(userdata)
  const onSubmit = async (data) => {
    // Here you would normally handle the login logic, e.g., checking credentials against a database.
    const res = await getAllUsers();
    const userdata = [];
    res.forEach(user => {  
        if(user.email==data.username){
            setuserdata(user);
            localStorage.setItem("userdata", JSON.stringify(user));
            navigate("/home")
        }
    })
    // console.log(user)
    // For now, let's just redirect to a dashboard or another page after login
    // navigate('/home'); // Adjust the path as needed
  };

  return (
    <div style={{height:"100vh"}} className='register'>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: 'center', marginBottom: "40px" }}>Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input style={{ width: "500px" }}
            type="text"
            placeholder="Enter Username"
            {...register('username', { required: true })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input style={{ width: "500px" }}
            type="password"
            placeholder="Enter Password"
            {...register('password', { required: true })}
          />
        </div>
        <div className="form-group">
          <input type="submit" className='submit-btn' value="Login" />
        </div>
      </form>
    </div>
  );
}

export default Login;
 