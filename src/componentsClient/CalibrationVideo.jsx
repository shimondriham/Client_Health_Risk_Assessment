import React from "react";
import { useNavigate } from "react-router-dom";

function CalibrationVideo() {
  const nav = useNavigate();

  const NextPage = () => {
    nav("/biomechanicalAss");
  };

  return (
    <div className="container text-center">
      <h2>Calibration Video</h2>

      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <video
          controls
          className="my-3 rounded border"
          style={{ width: '100%', height: 'auto' }}
          id="calibrationVideo"
        >
          <source src="/videos/121212.mp4" type="video/mp4" />
          הדפדפן שלך לא תומך בווידאו.
        </video>
      </div>

      <button id="calNextButton" className="btn btn-primary mt-3" onClick={NextPage}>
        Next
      </button>
    </div>
  );
}

export default CalibrationVideo;
