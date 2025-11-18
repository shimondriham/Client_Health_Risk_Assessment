import React from 'react'
import { useNavigate} from 'react-router-dom';
import {  useEffect, useRef, useState} from 'react';
import CameraComponent from './cameraComponent.jsx';


function Calibration() {

  return (
    <div className="d-flex justify-content-center align-items-center px-3" >
      <div className="bg-white p-5  text-center" style={{ maxWidth: '75%', width: '100%', borderRadius: '16px', maxHeight: '95vh', }}>
        <div className="mb-3">
          {/* <img style={{ height: '60px', width: '60px', borderRadius: '50px' }} src="src/assets/react.svg" alt="logo" /> */}
        </div>
        <h3 className="py-0">Media Device Check</h3>
        <div className=" mx-auto" style={{ width: '65%', overflow: 'hidden', borderRadius: '24px' }}>
          <CameraComponent />
        </div>
      </div>
    </div>
  )
}

export default Calibration