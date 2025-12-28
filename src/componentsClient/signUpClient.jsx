import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import reactIcon from '../assets/react.svg'; 
import '../App.css'; 

function SignUpClient() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubForm = (data) => {
    if(data.password !== data.ConfirmPassword) {
        return alert("Passwords do not match");
    }
    data.email = data.email.toLowerCase();
    const { ConfirmPassword, ...body } = data;
    doApi(body);
  };

  const doApi = async (_dataBody) => {
    try {
      let resp = await doApiMethod("/users", "POST", _dataBody);
      if (resp.data._id) {
        dispatch(addName({ name: _dataBody.fullName }));
        dispatch(addEmail({ email: _dataBody.email }));
        nav("/varification");
      }
    } catch (error) {
      alert("Error signing up.");
    }
  }

  // סגנון לכיווץ רווחים למניעת גלילה
  const compactGroupStyle = { marginBottom: '10px' };
  const compactInputStyle = { padding: '10px 16px' };

  return (
    <div className="login-wrapper" style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* --- לוגו עליון --- */}
            <nav className="top-nav" style={{ padding: '5px 0' }}>
              <img src={reactIcon} alt="Logo" width="22" className="logo-icon opacity-75" />
              <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
            </nav>

      {/* --- תוכן מרכזי --- */}
      <div className="login-content" style={{ justifyContent: 'center' }}>
        
        {/* כותרת בשורה אחת עם Fitwave מוגבה קצת */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline', 
            flexWrap: 'wrap',       
            marginBottom: '4px' 
        }}>
            <h1 className="main-title" style={{ fontSize: '1.6rem', margin: 0 }}>
              Create your
            </h1>
            
            <span className="brand-highlight" style={{ 
                fontSize: '2rem', 
                marginLeft: '8px', 
                marginRight: '8px',
                position: 'relative', 
                top: '-1px' 
            }}>
                Fitwave.ai
            </span>

            <h1 className="main-title" style={{ fontSize: '1.6rem', margin: 0 }}>
              account
            </h1>
        </div>
        
        <p className="subtitle" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
            Start your journey to vitality.
        </p>

        <form onSubmit={handleSubmit(onSubForm)} style={{width: '100%'}}>
            
            {/* Full Name */}
            <div className="form-group" style={compactGroupStyle}>
              <label className="form-label" style={{marginBottom: '4px'}}>Full Name*</label>
              <input 
                {...register("fullName", { required: "Name is required", minLength: 2 })}
                type="text" 
                placeholder="Enter your full name" 
                className="custom-input"
                style={compactInputStyle}
              />
              {errors.fullName && <small className="text-danger d-block" style={{fontSize: '0.75rem'}}>{errors.fullName.message}</small>}
            </div>

            {/* Email */}
            <div className="form-group" style={compactGroupStyle}>
              <label className="form-label" style={{marginBottom: '4px'}}>Email Address*</label>
              <input 
                {...register("email", { 
                    required: "Email is required", 
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                })}
                type="email" 
                placeholder="Enter your email" 
                className="custom-input"
                style={compactInputStyle}
              />
              {errors.email && <small className="text-danger d-block" style={{fontSize: '0.75rem'}}>{errors.email.message}</small>}
            </div>

            {/* Password */}
            <div className="form-group" style={compactGroupStyle}>
              <label className="form-label" style={{marginBottom: '4px'}}>Password*</label>
              <div className="input-container">
                <input 
                  {...register("password", { required: "Required", minLength: 4 })}
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password" 
                  className="custom-input"
                  style={compactInputStyle}
                />
              </div>
              {errors.password && <small className="text-danger d-block" style={{fontSize: '0.75rem'}}>Min 4 chars</small>}
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={compactGroupStyle}>
              <label className="form-label" style={{marginBottom: '4px'}}>Confirm Password*</label>
              <div className="input-container">
                <input 
                  {...register("ConfirmPassword", { required: "Required" })}
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Repeat password" 
                  className="custom-input"
                  style={compactInputStyle}
                />
                
              </div>
            </div>

            {/* Submit Button */}
            <button className="btn-login-orange" style={{marginTop: '5px', padding: '12px'}}>
                Create Account
            </button>
        </form>

        <div className="divider" style={{margin: '10px 0'}}>Or</div>

        {/* Login Link */}
        <div className="register-text" style={{marginTop: '15px'}}>
          Already have an account? 
          <span onClick={() => nav("/login")} className="register-link" style={{cursor: 'pointer'}}>
            Log in
          </span>
        </div>

      </div>

      {/* --- Footer --- */}
      <footer className="footer" style={{paddingTop: '10px'}}>
        <div>© Fitwave.ai 2026</div>
        <div className="footer-right">
          <span>✉️</span> support@fitwave.ai
        </div>
      </footer>

    </div>
  );
};

export default SignUpClient;