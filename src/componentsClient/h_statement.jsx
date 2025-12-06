import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function HStatement() {
  const [confirmed, setConfirmed] = useState(false);
  let nav = useNavigate();

  const CalibrationVideo = () => {
    nav("/CalibrationVideo");
  };

  return (
    <div className=" container mt-5  p-4 d-flex flex-column text-center" style={{ width: '80%', maxWidth: '1000px', backgroundColor: 'white' }}>
      <h2 >Health Declaration</h2>
      <ol >
        <li>
          I am feeling well and in suitable condition to participate in this
          assessment/activity.
        </li>
        <li>
          To the best of my knowledge, I have no medical condition or limitation
          that prevents participation.
        </li>
        <li>
          If I experience discomfort, pain, or fatigue during the activity, I
          will stop and notify the relevant party.
        </li>
        <li>
          I understand that this assessment/activity is not a substitute for
          professional medical advice, and I take personal responsibility for my
          participation.
        </li>
      </ol>

      <label style={{  display: "flex",alignItems: "center", gap: "10px", marginBottom: "20px",}}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <span>I confirm the health declaration and wish to continue</span>
      </label>

      {confirmed && 
      (<div className='m-2 text-center'>
          <button  onClick={CalibrationVideo} className='btn btn-primary btn-lg w-50'>Continue</button>
        </div>
      )}    
    </div>
  );
}