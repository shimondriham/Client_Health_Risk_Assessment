import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addIfShowNav } from '../featuers/myDetailsSlice';
import { FaBars } from "react-icons/fa";

function HeaderClient() {
  const nav = useNavigate();
  
  const dispatch = useDispatch();
  const IfShowNav = useSelector(state => state.myDetailsSlice.ifShowNav);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const menuItems = [
  //   { label: "Logout", action: () => onClick={onlogout} },
  //   { label: "Admin", action: () => alert("Admin") },
    
  // ];
  const Admin = () => nav("/admin");
  const onWelcomeClick = () => nav("/");
  const onHomeClick = () => nav("/homeClient");
  const onSignUpClick = () => nav("/signup");
  const onVarifictionClick = () => nav("/varification");
  const onloginClick = () => nav("/login");
  const onExplanatoryVClick = () => nav("/explanatoryV");
  const onBioMClick = () => nav("/biomechanicalAss");
  const onCaliClick = () => nav("/Calibration");
  const onCaliVClick = () => nav("/CalibrationVideo");
  const onH_statementClick = () => nav("/h_statement");
  const onHealthFormClick = () => nav("/healthForm");
  const onOutComeClick = () => nav("/OutCome");
  const onReportsClick = () => nav("/Reports");
  const onlogout = () => { dispatch(addIfShowNav({ ifShowNav: false })); nav("/logout"); }

   const menuItems = [
    { label: "Logout", action: () => onlogout() },
    { label: "Admin", action: () => Admin() },
    
  ];
  return (
    <div className='p-2'>
      <div className='d-flex align-items-center justify-content-center flex-wrap'>

        {/* before login */}
        {!IfShowNav && <button className='btn btn-info m-1' onClick={onWelcomeClick}>Welcome</button>}
        {!IfShowNav && <button className='btn btn-info m-1' onClick={onSignUpClick}>Sign Up</button>}
        {!IfShowNav && <button className='btn btn-info m-1' onClick={onVarifictionClick}>Verification</button>}
        {!IfShowNav && <button className='btn btn-info m-1' onClick={onloginClick}>Login</button>}

        {/* after login */}
        {IfShowNav &&
          <img 
            src="src/assets/react.svg"
            alt="icon"
            className="m-1"
            style={{ height: "38px", width: "38px", objectFit: "contain", cursor: "pointer" }}
            onClick={onHomeClick}
          />}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onHomeClick}>Home</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onExplanatoryVClick}>ExplanatoryV</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onHealthFormClick}>Health Form</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onCaliVClick}>Calibration Video</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onCaliClick}>Calibration</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onH_statementClick}>Health Statement</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onBioMClick}>Bio Assessment</button>}
        {IfShowNav && <button className='btn btn-info m-1' onClick={onOutComeClick}>Outcome</button>}
        {/* {IfShowNav && <button className='btn btn-info m-1' onClick={onReportsClick}>Reports</button>} */}
        {/* {IfShowNav && <button className='btn btn-info m-1' onClick={onlogout}>Logout</button>} */}

{IfShowNav && IsAdmin &&
  <div style={{ position: "relative" }} ref={menuRef}>
    <FaBars size={32} className="m-1" style={{ cursor: "pointer" }} onClick={toggleMenu} />

    <div
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        width: "90px",
        overflow: "hidden",
        borderRadius: "4px",
        zIndex: 100,
        padding: "10px",
        backgroundColor: "transparent", 
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={item.action}
          style={{
            padding: "8px 0",
            cursor: "pointer",
            transform: menuOpen ? "translateX(0) scale(1)" : "translateX(50px) scale(0.9)",
            opacity: menuOpen ? 1 : 0,
            transition: `all 0.3s ease ${(index + 1) * 0.1}s`,
            borderRadius: "4px",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#d0eaff"; 
            e.currentTarget.style.color = "#007bff";
            e.currentTarget.style.transform = "translateX(0) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "black";
            e.currentTarget.style.transform = "translateX(0) scale(1)";
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  </div>
        }

      </div>
    </div>
  );
}

export default HeaderClient;
