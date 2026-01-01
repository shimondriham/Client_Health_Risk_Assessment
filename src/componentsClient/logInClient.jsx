import React, { useState } from 'react'; // הוספתי useState בשביל העין של הסיסמה אם תרצי
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addIfShowNav, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import { saveTokenLocal } from '../services/localService';
import thisIcon from '../assets/icon.png';
import '../App.css'; // חובה: וודאי שה-CSS מהתגובה הקודמת נמצא כאן!

const LoginClient = () => {
  let nav = useNavigate();
  let { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  
  // סטייט להצגה/הסתרה של סיסמה (אופציונלי, אבל קיים בעיצוב)
  const [showPassword, setShowPassword] = useState(false);

  const onSubForm = (data) => {
    data.email = data.email.toLowerCase();
    doApi(data);
  }

  const doApi = async (_dataBody) => {
    try {
      let resp = await doApiMethod("/users/login", "POST", _dataBody);
      if (resp.data.token) {
        saveTokenLocal(resp.data.token);
        dispatch(addName({ name: resp.data.fullName || "User" })); 
        dispatch(addEmail({ email: _dataBody.email }));
        dispatch(addIfShowNav({ ifShowNav: true }));
        nav("/homeClient");
      }
    } catch (error) {
      alert("Login failed, please check your credentials.");
    }
  }

  return (
    <div className="login-wrapper">
      
      {/* --- לוגו עליון --- */}
                  <nav className="top-nav" style={{ padding: '5px 0' }}>
                    <img src={thisIcon} alt="Logo" width="35" className="logo-icon opacity-75" />
                    <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
                  </nav>

      {/* --- תוכן מרכזי --- */}
      <div className="login-content">
        
        {/* כותרת מעוצבת לפי התמונה */}
        <h1 className="main-title">
          Welcome Back to <span className="brand-highlight">Fitwave.ai</span> 
        </h1>
        <p className="subtitle">Start your journey to mastering interviews.</p>

        <form onSubmit={handleSubmit(onSubForm)} style={{width: '100%'}}>
            
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email*</label>
              <input 
                {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })} 
                type="email" 
                placeholder="Enter your email" 
                className="custom-input"
              />
              {errors.email && <small className='text-danger d-block mt-1'>{errors.email.message}</small>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">Password*</label>
              <div className="input-container">
                <input 
                  {...register("password", { required: "Password is required", minLength: { value: 3, message: "Min length is 3" } })} 
                  type={showPassword ? "text" : "password"} // החלפה בין טקסט לסיסמה
                  placeholder="Enter your password" 
                  className="custom-input"
                />
                
              </div>
              {errors.password && <small className='text-danger d-block mt-1'>{errors.password.message}</small>}
            </div>

            {/* כפתור Submit */}
            <button className="btn-login-orange">Sign in</button>
        </form>


        {/* קישור להרשמה */}
        <div className="register-text">
          Don't have an account? 
          <span 
            onClick={() => nav("/SignUp")} 
            className="register-link" 
            style={{cursor: 'pointer'}}
          >
            Register
          </span>
        </div>
      </div>

      {/* --- פוטר --- */}
      <footer className="footer">
        <div>© Fitwave.ai 2026</div>
        <div className="footer-right">
          <span>✉️</span> support@fitwave.ai
        </div>
      </footer>

    </div>
  );
};

export default LoginClient;
