import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addIfShowNav, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import { saveTokenLocal } from '../services/localService';
import reactIcon from '../assets/react.svg';

const LoginClient = () => {
  let nav = useNavigate();
  let { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const ORANGE = "#F96424";

  const onSubForm = (data) => {
    data.email = data.email.toLowerCase();
    doApi(data);
  }

  const doApi = async (_dataBody) => {
    try {
      let resp = await doApiMethod("/users/login", "POST", _dataBody);
      if (resp.data.token) {
        saveTokenLocal(resp.data.token);
        dispatch(addName({ name: _dataBody.fullName })); // וודא שהשרת מחזיר fullName
        dispatch(addEmail({ email: _dataBody.email }));
        dispatch(addIfShowNav({ ifShowNav: true }));
        nav("/homeClient");
      }
    } catch (error) {
      alert("Login failed, please try again.");
    }
  }

  return (
    <div className="vh-100 bg-white d-flex flex-column font-sans text-dark overflow-hidden">
      
      {/* Navbar Minimal */}
      <nav className="d-flex align-items-center px-4 py-3" style={{ height: '60px' }}>
        <img src={reactIcon} alt="Logo" width="24" />
        <span className="ms-2 fw-bold fst-italic" style={{fontSize: '1.1rem'}}>Fitwave.ai</span>
      </nav>

      {/* Main Content Centered */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="w-100 px-3" style={{ maxWidth: '400px' }}>
          
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1 fs-2">Welcome back</h2>
            <p className="text-muted small m-0">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubForm)}>
            
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label fw-bold small m-0 text-secondary">Email</label>
              <input 
                {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} 
                type="email" 
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                placeholder="Enter your email" 
              />
              {errors.email && <small className='text-danger ps-1' style={{fontSize: '0.75rem'}}>Invalid email</small>}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                 <label className="form-label fw-bold small m-0 text-secondary">Password</label>
                 <span className="small fw-bold" style={{cursor:'pointer', color: ORANGE, fontSize: '0.75rem'}}>Forgot password?</span>
              </div>
              <input 
                {...register("password", { required: true, minLength: 3 })} 
                type="password" 
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                placeholder="Enter your password" 
              />
              {errors.password && <small className='text-danger ps-1' style={{fontSize: '0.75rem'}}>Min 3 chars required</small>}
            </div>

            {/* Submit Button */}
            <button className="btn w-100 py-2 fw-bold text-white rounded-pill mb-3 shadow-none" style={{ backgroundColor: ORANGE }}>
              Sign in
            </button>

          </form>

          {/* Footer Link */}
          <div className="text-center small text-muted">
            Don't have an account? 
            <span 
                onClick={() => nav("/SignUp")} 
                className="fw-bold ms-1" 
                style={{ cursor: 'pointer', color: ORANGE }}
            >
              Sign up
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginClient;
