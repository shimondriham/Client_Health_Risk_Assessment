import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";

const Welcome = () => {
    let nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, []);

    const toSignIn = () => nav("/login");
    const toSignUp = () => nav("/SignUp");


    const gradientStyle = {
        background: "linear-gradient(90deg, #4f46e5 0%, #ec4899 100%)",
        border: "none",
        color: "white"
    };

    return (
        <div className="min-vh-100 bg-white d-flex flex-column font-sans">
            
            <nav className="d-flex justify-content-between align-items-center px-4 py-3">
                <div className="d-flex align-items-center gap-2">
                    <img src="src/assets/react.svg" alt="FITWAVE Logo" style={{ width: "35px" }} />
                    <span className="fw-bold fs-4 text-dark">FITWAVE</span>
                </div>
                <button onClick={toSignIn} className="btn btn-light fw-bold px-4 rounded-3 text-secondary">
                    Log In
                </button>
            </nav>

            <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3">
                <div style={{ maxWidth: "850px" }}>
                    
                    <h1 className="display-3 fw-bolder mb-3 text-dark lh-sm">
                        The smart health app,<br />
                        for <span className="text-primary">your well-being.</span>
                    </h1>

                    <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "700px", fontSize: "1.25rem" }}>
                        FITWAVE transforms your home camera into an advanced diagnostic tool. 
                        We conduct smart biomechanical assessments to identify limitations, 
                        prevent injuries, and enhance quality of life for those aged 40+.
                    </p>

                    <button 
                        onClick={toSignUp} 
                        className="btn btn-lg px-5 py-3 fw-bold shadow-sm rounded-3" 
                        style={gradientStyle}
                    >
                        Get Started. It's FREE &rarr;
                    </button>

                    <p className="text-muted mt-3 small">No credit card required.</p>
                </div>
            </main>

        </div>
    );
}

export default Welcome;