import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function CalibrationVideo() {
  const [checked, setChecked] = useState(false);
  let nav = useNavigate();

    const NextPage = () => {
    nav("/Calibration");
  };

  return (
    <div className="container mt-1 text-center">
         <h1>Logo</h1>
      <h2>Calibration Video</h2>

      <video 
      width="720" 
      controls 
      className="my-3 rounded border"
      >
      <source src="/videos/121212.mp4" type="video/mp4" />
      הדפדפן שלך לא תומך בווידאו.
      </video>

      <div className="form-check d-flex align-items-center justify-content-center">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="confirmCheck"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="confirmCheck">
         I confirm that I have successfully completed the calibration.
        </label>
      </div>

      <button className="btn btn-primary mt-3" disabled={!checked} onClick={NextPage}>
        Next
      </button>
    </div>
  );
}

export default CalibrationVideo;
