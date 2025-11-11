import React from 'react'
import { useNavigate } from 'react-router-dom';


function Calibration() {

  return (
    <div className="d-flex justify-content-center align-items-center px-3" style={{  overflow: 'hidden' }}>
      <div className="bg-white p-5  text-center" style={{ maxWidth: '75%', width: '100%', borderRadius: '16px', maxHeight: '95vh', overflow: 'auto' }}>
        <div className="mb-3">
          <img style={{ height: '60px', width: '60px', borderRadius: '50px' }} src="src/assets/react.svg" alt="logo" />
        </div>
        <h3 className="py-2">Media Device Check</h3>
        <div className="border mx-auto" style={{ height: '400px', width: '80%', borderRadius: '8px', backgroundColor: '#f8f9fa' }}></div>
      </div>
    </div>
  )
}

export default Calibration