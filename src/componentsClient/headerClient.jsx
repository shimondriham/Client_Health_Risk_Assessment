import React from 'react'
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from '../featuers/myDetailsSlice';
import { useDispatch, useSelector } from 'react-redux';

function HeaderClient() {
  let nav = useNavigate()
  const dispatch = useDispatch();
  const IfShowNav = useSelector(state => state.myDetailsSlice.ifShowNav);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);

  const onWelcomeClick = () => {
    nav("/");
  }
  const onHomeClick = () => {
    nav("/homeClient");
  }
  const onSignUpClick = () => {
    nav("/signup");
  }
  const onVarifictionClick = () => {
    nav("/varification");
  }
  const onloginClick = () => {
    nav("/login");
  }
  const onBioMClick = () => {
    nav("/biomechanicalAss");
  }
  const onCaliClick = () => {
    nav("/Calibration");
  }
  const onCaliVClick = () => {
    nav("/CalibrationVideo");
  }
  const onH_statementClick = () => {
    nav("/h_statement");
  }
  const onHealthFormClick = () => {
    nav("/healthForm");
  }
  const onOutComeClick = () => {
    nav("/OutCome");
  }
  const onReportsClick = () => {
    nav("/Reports");
  }
  
  const onlogout = () => {
    dispatch(addIfShowNav({ ifShowNav: false }));
    nav("/logout");
  }
  const onAdminClick = () => {
    nav("/Admin");
  }





  return (
    <div className='p-3 container'>
      <div className='d-flex flex-wrap gap-3 justify-content-center'>
          <button className='btn btn-info border-black px-4 m-1' onClick={onWelcomeClick}>Welcome</button>
        
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onSignUpClick}>Sign Up</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onVarifictionClick}>Verification</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onloginClick}>Login</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onBioMClick}>Bio Assessment</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onCaliClick}>Calibration</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onCaliVClick}>Calibration Video</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onH_statementClick}>Health Statement</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onHealthFormClick}>Health Form</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onOutComeClick}>Outcome</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-4 m-1' onClick={onReportsClick}>Reports</button>
        }

        {IfShowNav ?
          <button className='btn btn-info border-black px-4 m-1' onClick={onHomeClick}>Home</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-4 m-1' onClick={onlogout}>Logout</button>
          : ""}
        {IfShowNav && IsAdmin ?
          <button className='btn btn-info border-black px-4 m-1' onClick={onAdminClick}>Admin</button>
          : ""}
    

      </div>
    </div>
  )
}

export default HeaderClient