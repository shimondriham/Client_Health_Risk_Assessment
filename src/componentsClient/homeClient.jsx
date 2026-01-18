import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import thisIcon from '../assets/icon.png';
import { forEach } from 'lodash';

// --- Icons (Existing - Right Side) ---
const ChartIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>;
const CheckIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const TimeIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;

// --- NEW Icons for Health Cards (FIXED VISIBILITY) ---
// Shield (Cardio)
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
// Diamond (Strength) - Using a simple shape
const DiamondIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>;
// Person/Balance
const BalanceIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
// Mobility/Joints
const MobilityIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;

// Small Check for Footer
const SmallCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

// --- Health Profile Card Component ---
const HealthProfileCard = ({ title, icon, badgeText, badgeBg, badgeColor, description, footerText, iconBg }) => {
    return (
        <div className="bg-white rounded-4 p-3 border shadow-sm h-100 d-flex flex-column hover-lift" style={{ minHeight: '180px' }}>
            <div className="d-flex align-items-start gap-3 mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '42px', height: '42px', backgroundColor: iconBg }}>
                    {icon}
                </div>
                <div>
                    <h6 className="fw-bold text-dark font-swiss m-0 mb-1" style={{ fontSize: '0.95rem' }}>{title}</h6>
                    <span className="badge rounded-pill fw-medium"
                        style={{ backgroundColor: badgeBg, color: badgeColor, fontSize: '0.7rem', padding: '5px 10px' }}>
                        {badgeText}
                    </span>
                </div>
            </div>
            <div className="flex-grow-1 mt-1">
                <p className="text-secondary small m-0" style={{ lineHeight: '1.5', fontSize: '0.85rem' }}>
                    {description}
                </p>
            </div>
            <div className="mt-3 pt-2 border-top border-light d-flex align-items-center text-muted" style={{ fontSize: '0.7rem' }}>
                <span className="me-1 text-success"><SmallCheck /></span>
                <span>{footerText}</span>
            </div>
        </div>
    );
};

// --- Stat Box ---
const StatBox = ({ label, value, icon, color, bg }) => (
    <div className="bg-white rounded-4 p-3 border shadow-sm h-100 d-flex flex-column justify-content-between hover-lift">
        <div className="d-flex justify-content-between align-items-start">
            <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{label}</div>
            <div className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', backgroundColor: bg, color: color }}>
                {icon}
            </div>
        </div>
        <div className="fw-bold text-dark fs-3 lh-1 font-swiss mt-2">{value}</div>
    </div>
);

const HomeClient = () => {
    // --- Data ---
    const _tests = [
        { _id: 1, date_created: "2025-01-22T10:00:00", finished: true, finishedT1: true },
        { _id: 2, date_created: "2025-01-20T14:30:00", finished: false, finishedT1: false },
        { _id: 3, date_created: "2025-01-18T09:15:00", finished: false, finishedT1: true },
        { _id: 4, date_created: "2025-01-15T09:15:00", finished: true, finishedT1: true },
        { _id: 5, date_created: "2025-01-12T09:15:00", finished: true, finishedT1: true },
        { _id: 6, date_created: "2025-01-10T09:15:00", finished: true, finishedT1: true },
        { _id: 7, date_created: "2025-01-08T09:15:00", finished: true, finishedT1: true },
        { _id: 8, date_created: "2025-01-05T09:15:00", finished: true, finishedT1: true },
        { _id: 9, date_created: "2025-01-03T09:15:00", finished: true, finishedT1: true },
    ];

    const myName = useSelector(state => state.myDetailsSlice.name) || "User";
    const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
    const navigate = useNavigate();
    const [tests, setTests] = useState(_tests);
    const [testsF, setTestsf] = useState({});
    const [hasTests, setHasTests] = useState(true);
    const completedCount = tests.filter(t => t.finished).length;
    const pendingCount = tests.length - completedCount;

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const ORANGE = "#F96424";
    const brandDark = "#1a1a1a";

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: true }));
        dispatch(addIdQuestions({ idQuestions: "0" }));
        fetchUserData();
        const handleClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUserData = async () => {
        try {
            let data = await doApiGet("/users/myInfo");
         
            
            dispatch(addName({ name: data.data.fullName }));
            if (data.data.role === "admin") dispatch(addIsAdmin({ isAdmin: true }));
            try {
                let qResp = await doApiGet("/questions/myInfo");
                if (qResp.data && qResp.data.length > 0) {
                    setTests(qResp.data); setHasTests(true); dispatch(addIdQuestions({ idQuestions: qResp.data._id }));
                    let tempTestsf = [];
                    forEach(qResp.data, (item) => { if (item.finished) { tempTestsf.push(item); } });
                    setTestsf(tempTestsf[tempTestsf.length - 1]);
                   
                    
                    
                } else { setHasTests(false); }
            } catch (err) { setHasTests(false); }
        } catch (error) { console.log(error); }
    };

    return (
        <div className="vh-100 d-flex flex-column bg-light overflow-hidden page-wrapper">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Inter:wght@300;400;500;600;700&display=swap');
                
                .page-wrapper {
                    font-family: 'Swissintl', 'Inter', -apple-system, sans-serif !important;
                    font-size: 16px;
                    color: ${brandDark};
                    background-color: #F8F9FA;
                }
                .logo-font { font-family: 'Oooh Baby', cursive !important; }
                .font-swiss { font-family: 'Swissintl', 'Inter', sans-serif !important; }
                
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                
                .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
                
                .burger-btn { transition: background-color 0.2s ease; }
                .burger-btn:hover { background-color: #f0f0f0 !important; }

                .action-gradient {
                    background: linear-gradient(135deg, ${ORANGE}, #FF8A5B);
                    color: white;
                }
                
                .modern-table th { 
                    font-size: 0.75rem; text-transform: uppercase; color: #6B7280; font-weight: 600; letter-spacing: 0.5px;
                    padding: 1rem 1.5rem; border-bottom: 1px solid #f3f4f6; background: #fff;
                }
                .modern-table td { 
                    padding: 1rem 1.5rem; font-size: 0.95rem; color: #111; vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }
                .modern-table tr:hover { background-color: #fafafa; }
            `}</style>

            {/* === NAVBAR === */}
            <nav className="px-4 py-3 d-flex align-items-center justify-content-between bg-white border-bottom shadow-sm flex-shrink-0" style={{ zIndex: 100 }}>
                <div className="d-flex align-items-center gap-2">
                    <img src={thisIcon} alt="Logo" width="32" className="opacity-80" />
                    <span className="logo-font" style={{ fontSize: '2rem', lineHeight: 0.8, color: '#111' }}>Fitwave.ai</span>
                </div>

                <div className="d-flex align-items-center gap-4">
                    <div className="d-none d-md-block text-end">
                        <div className="fw-bold text-dark font-swiss">{greeting}, {myName}</div>
                        <div className="text-muted small">Overview</div>
                    </div>

                    <div style={{ position: "relative" }} ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="bg-white border p-2 rounded-circle burger-btn text-dark shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <MenuIcon />
                        </button>
                        {menuOpen && (
                            <div className="bg-white rounded-4 shadow-lg border position-absolute end-0 mt-3 py-2 animate__animated animate__fadeIn" style={{ width: "180px", zIndex: 100 }}>
                                {IsAdmin && (
                                    <div
                                        onClick={() => navigate("/admin")}
                                        className="px-4 py-2 cursor-pointer hover-bg-light fw-medium small text-dark border-bottom"
                                    >
                                        Admin Panel
                                    </div>
                                )}
                                <div onClick={() => { dispatch(addIfShowNav({ ifShowNav: false })); navigate("/logout"); }} className="px-4 py-2 cursor-pointer hover-bg-light fw-medium text-danger small">Log Out</div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* === MAIN CONTENT === */}
            <div className="flex-grow-1 overflow-hidden p-4">
                <div className="container-fluid h-100 px-0" style={{ maxWidth: '1600px', margin: '0 auto' }}>

                    {!hasTests ? (
                        /* --- מצב משתמש חדש --- */
                        <div className="h-100 d-flex justify-content-center align-items-center">
                            <div className="bg-white rounded-5 shadow-sm border p-5 text-center" style={{ maxWidth: '500px' }}>
                                <div className="mb-4 d-inline-flex p-4 rounded-circle" style={{ background: '#FFF4E5' }}>
                                    <PlayIcon stroke={ORANGE} width="40" height="40" />
                                </div>
                                <h2 className="fw-bold mb-3 display-6 font-swiss">Start Your Journey</h2>
                                <p className="text-muted mb-5">
                                    Perform your first AI biomechanical assessment to unlock your personalized dashboard.
                                </p>
                                <button
                                    onClick={() => navigate("/explanatoryV")}
                                    className="btn btn-lg rounded-pill px-5 py-3 fw-bold action-gradient w-100 shadow hover-lift border-0"
                                >
                                    Start Assessment
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* --- מצב משתמש קיים --- */
                        <div className="row h-100 g-4">

                            {/* === צד שמאל: HEALTH PROFILE CARDS === */}
                            <div className="col-lg-6 d-flex flex-column h-100 overflow-hidden justify-content-center">
                                <div className="d-flex align-items-center justify-content-between mb-3 flex-shrink-0">
                                    <h5 className="fw-bold m-0 text-dark font-swiss">Your Health Profile</h5>
                                </div>

                                <div className="overflow-y-auto overflow-x-hidden pe-1 pb-2">
                                    <div className="row g-3">
                                        <div className="col-6">
                                           
                                            
                                            <HealthProfileCard
                                                title="Cardiovascular"
                                                icon={<ShieldIcon />}
                                                iconBg="#FFFBEB"
                                                badgeText={testsF.cardio_readiness?.[0] ? testsF.cardio_readiness?.[0] : "--- No Data ---"}
                                                badgeBg="#FEF3C7"
                                                badgeColor="#D97706"
                                                description={testsF.cardio_readiness?.[1] ? testsF.cardio_readiness?.[1] : "--- No Data ---"}
                                                footerText="Screened via guidelines"
                                            />
                                            
                                            
                                            
                                            
                                            
                                            
                                        </div>
                                        <div className="col-6">
                                            <HealthProfileCard
                                                title="Functional Strength"
                                                icon={<DiamondIcon />}
                                                iconBg="#ECFDF5"
                                                badgeText={testsF.functional_strength?.[0] ? testsF.functional_strength?.[0] : "--- No Data ---"}
                                                badgeBg="#D1FAE5"
                                                badgeColor="#059669"
                                                description={testsF.functional_strength?.[1] ? testsF.functional_strength?.[1] : "--- No Data ---"}
                                                footerText="Screened via mobility tests"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <HealthProfileCard
                                                title="Balance & Falls"
                                                icon={<BalanceIcon />}
                                                iconBg="#FFFBEB"
                                                badgeText={testsF.balance_fall_risk?.[0] ? testsF.balance_fall_risk?.[0] : "--- No Data ---"}
                                                badgeBg="#FEF3C7"
                                                badgeColor="#D97706"
                                                description={testsF.balance_fall_risk?.[1] ? testsF.balance_fall_risk?.[1] : "--- No Data ---"}
                                                footerText="Screened via STEADI tests"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <HealthProfileCard
                                                title="Mobility & Pain"
                                                icon={<MobilityIcon />}
                                                iconBg="#FFFBEB"
                                                badgeText={testsF.mobility_pain?.[0] ? testsF.mobility_pain?.[0] : "--- No Data ---"}
                                                badgeBg="#FEF3C7"
                                                badgeColor="#D97706"
                                                description={testsF.mobility_pain?.[1] ? testsF.mobility_pain?.[1] : "--- No Data ---"}
                                                footerText="Screened via ROM tests"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*צד ימין: OVERVIEW  */}
                            <div className="col-lg-6 d-flex flex-column h-100 overflow-hidden gap-4">
                                <h5 className="fw-bold m-0 text-dark mb-0 font-swiss flex-shrink-0">Overview</h5>

                                <div className="row g-3 flex-shrink-0">
                                    <div className="col-md-5 p-1">
                                        <div
                                            onClick={() => navigate("/explanatoryV")}
                                            className="action-gradient rounded-4 p-4 d-flex align-items-center justify-content-between cursor-pointer shadow-sm hover-lift h-100"
                                        >
                                            <div className="ps-2">
                                                <h3 className="fw-bold mb-1 font-swiss">New Scan</h3>
                                                <p className="m-0 opacity-90 small">Start new analysis</p>
                                            </div>
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-2">
                                                <PlayIcon />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <div className="row g-3 h-100">
                                            <div className="col-4">
                                                <StatBox label="Total" value={tests.length} icon={<ChartIcon />} bg="#F3F4F6" color="#6B7280" />
                                            </div>
                                            <div className="col-4">
                                                <StatBox label="Done" value={completedCount} icon={<CheckIcon />} bg="#ECFDF5" color="#10B981" />
                                            </div>
                                            <div className="col-4">
                                                <StatBox label="Pending" value={pendingCount} icon={<TimeIcon />} bg="#FFF7ED" color={ORANGE} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow-1 bg-white rounded-4 border shadow-sm d-flex flex-column overflow-hidden">
                                    <div className="px-4 py-3 border-bottom bg-white flex-shrink-0">
                                        <h6 className="fw-bold m-0 text-dark font-swiss">Recent History</h6>
                                    </div>

                                    <div className="overflow-y-auto flex-grow-1 custom-scrollbar p-0">
                                        <table className="w-100 modern-table">
                                            <thead className="bg-white sticky-top" style={{ top: 0, zIndex: 10 }}>
                                                <tr>
                                                    <th className="ps-4">ID</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th className="text-end pe-4">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tests.map((test, i) => (
                                                    <tr key={i}>
                                                        <td className="fw-bold text-dark ps-4">#{i + 1001}</td>
                                                        <td className="text-secondary">{test.date_created.substring(0, 10)}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill px-3 py-2 fw-medium font-swiss ${test.finished ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: '0.7rem' }}>
                                                                {test.finished ? 'COMPLETED' : 'PENDING'}
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <button
                                                                onClick={() => { dispatch(addIdQuestions({ idQuestions: test._id })); test.finished ? navigate(`/outCome`) : (test.finishedT1 ? navigate(`/calibration`) : navigate(`/HealthForm`)); }}
                                                                className={`btn btn-sm rounded-pill fw-bold px-3 hover-lift ${test.finished ? 'btn-light border text-muted' : 'text-white'}`}
                                                                style={!test.finished ? { backgroundColor: ORANGE, border: 'none' } : {}}
                                                            >
                                                                {test.finished ? 'Report' : 'Continue'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeClient;