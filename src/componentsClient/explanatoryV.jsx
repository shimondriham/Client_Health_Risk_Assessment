import React from "react";
import { useNavigate } from "react-router-dom";

function ExplanatoryV() {
  const nav = useNavigate();

  const NextPage = () => {
    nav("/healthForm");
  };

  return (
    <div className="container text-center">
      <h2>ExplanatoryV</h2>

      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <video
          controls
          className="my-3 rounded border"
          style={{ width: '100%', height: 'auto' }}
          id="explanatoryVideo"
        >
          <source src="/videos/121212.mp4" type="video/mp4" />
          הדפדפן שלך לא תומך בווידאו.
        </video>
      </div>

      <button id="nextButton" className="btn btn-primary mt-3" onClick={NextPage}>
        Next
      </button>
    </div>
  );
}

export default ExplanatoryV;