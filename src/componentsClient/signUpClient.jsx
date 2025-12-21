import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import logo from '../assets/react.svg'; 

function SignUpClient() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const ORANGE = "#F96424"; 

  const onSubForm = (data) => {
    if(data.password !== data.ConfirmPassword) return alert("Passwords do not match");
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

  // --- סגנונות עדינים ודקים ---
  const styles = {
    input: {
      backgroundColor: "#F3F4F6", // אפור בהיר מאוד ועדין
      fontSize: "0.9rem",         // פונט קטן יותר בשדה
      fontWeight: "400",          // פונט דק (רגיל)
      padding: "10px 15px",       // פחות גובה (יותר דק)
      borderRadius: "8px"         // פינות מעוגלות בעדינות
    },
    label: {
      fontSize: "0.85rem",
      fontWeight: "500",          // לא מודגש מידי
      color: "#4B5563",           // אפור כהה (לא שחור)
      marginBottom: "4px"
    },
    button: {
      backgroundColor: ORANGE,
      padding: "10px",            // כפתור דק יותר
      fontSize: "0.95rem",
      fontWeight: "600",          // מודגש עדין
      borderRadius: "50px",       // עגול מלא
      letterSpacing: "0.3px"      // ריווח אותיות קליל למראה יוקרתי
    }
  };

  return (
    <div className="vh-100 bg-white d-flex flex-column font-sans text-dark overflow-hidden position-relative">
      
      {/* 1. לוגו עדין בצד */}
      <div className="position-absolute top-0 start-0 p-4">
        <div className="d-flex align-items-center">
             <img src={logo} alt="Logo" width="22" className="me-2 opacity-75"/>
             <span className="fw-semibold fst-italic" style={{fontSize:'1rem', color:'#333'}}>Fitwave.ai</span>
        </div>
      </div>

      {/* 2. תוכן מרכזי */}
      <div className="d-flex justify-content-center align-items-center h-100 w-100">
        <div style={{ width: '100%', maxWidth: '380px', padding: '20px' }}>
          
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>
                Create account
            </h2>
            <p className="text-muted small" style={{fontWeight: '400'}}>Start your journey to vitality</p>
          </div>

          <form onSubmit={handleSubmit(onSubForm)}>
            
            {/* Full Name */}
            <div className="mb-3">
              <label style={styles.label}>Full Name</label>
              <input 
                {...register("fullName", { required: true, minLength: 2 })}
                className="form-control border-0 shadow-none"
                style={styles.input}
                placeholder="Name"
              />
              {errors.fullName && <small className="text-danger ps-1" style={{fontSize:'0.7rem'}}>Name required</small>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label style={styles.label}>Email</label>
              <input 
                {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                className="form-control border-0 shadow-none"
                style={styles.input}
                placeholder="Email address"
              />
              {errors.email && <small className="text-danger ps-1" style={{fontSize:'0.7rem'}}>Invalid email</small>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label style={styles.label}>Password</label>
              <input 
                {...register("password", { required: true, minLength: 4 })}
                type="password"
                className="form-control border-0 shadow-none"
                style={styles.input}
                placeholder="Password"
              />
              {errors.password && <small className="text-danger ps-1" style={{fontSize:'0.7rem'}}>Min 4 chars</small>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label style={styles.label}>Confirm Password</label>
              <input 
                {...register("ConfirmPassword", { required: true })}
                type="password"
                className="form-control border-0 shadow-none"
                style={styles.input}
                placeholder="Confirm password"
              />
            </div>

            {/* Submit Button - דק ונקי */}
            <button 
              className="btn w-100 text-white border-0 shadow-none mb-3"
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Create account
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center" style={{fontSize: '0.85rem', color: '#666'}}>
            Already have an account? 
            <span 
              onClick={() => nav("/login")} 
              className="fw-semibold ms-1" 
              style={{ color: ORANGE, cursor: 'pointer' }}
            >
              Log in
            </span>
          </div>

        </div>
      </div>

      {/* 3. פוטר דק וקטן */}
      <div className="position-absolute bottom-0 w-100 px-4 py-3 d-flex justify-content-between align-items-center text-muted" style={{fontSize: '0.75rem'}}>
          <div>© Fitwave.ai 2026</div>
          <div>support@fitwave.ai</div>
      </div>

    </div>
  );
};

export default SignUpClient;