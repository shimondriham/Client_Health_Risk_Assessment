import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExplanatoryV() {
 const [checked, setChecked] = useState(false);
  let nav = useNavigate();

    const NextPage = () => {
    nav("/HealthForm");
  };

  return (
    <div className="container  text-center">
          {/* <img style={{ height: '60px', width: '60px', borderRadius: '50px' }} src="src/assets/react.svg" alt="logo" /> */}
      <h2>ExplanatoryV</h2>

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

export default ExplanatoryV