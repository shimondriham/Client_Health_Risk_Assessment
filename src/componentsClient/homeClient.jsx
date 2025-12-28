import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../assets/react.svg'; 

// --- Icons ---
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const BarsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CheckCircle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ChartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;

const HomeClient = () => {
  const _tests = [
    { _id: 1, date_created: "2025-01-22T10:00:00", finished: true, finishedT1: true },
    { _id: 2, date_created: "2025-01-20T14:30:00", finished: false, finishedT1: false },
    { _id: 3, date_created: "2025-01-18T09:15:00", finished: false, finishedT1: true },
    { _id: 4, date_created: "2025-01-15T09:15:00", finished: true, finishedT1: true },
    { _id: 5, date_created: "2025-01-12T09:15:00", finished: true, finishedT1: true },
    { _id: 6, date_created: "2025-01-10T09:15:00", finished: true, finishedT1: true },
    { _id: 7, date_created: "2025-01-08T09:15:00", finished: true, finishedT1: true },
    { _id: 8, date_created: "2025-01-05T09:15:00", finished: false, finishedT1: true },
  ];

  const myName = useSelector(state => state.myDetailsSlice.name);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [tests, setTests] = useState(_tests);
  const [hasTests, setHasTests] = useState(true);
  const completedCount = tests.filter(t => t.finished).length;
  const pendingCount = tests.length - completedCount;
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const ORANGE = "#F96424";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    dispatch(addIdQuestions({ idQuestions: "0" }));
    fetchUserData();
    const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Admin Panel", action: () => navigate("/admin"), show: IsAdmin },
    { label: "Logout", action: () => { dispatch(addIfShowNav({ ifShowNav: false })); navigate("/logout"); }, show: true },
  ];

  const fetchUserData = async () => {
    try {
      let data = await doApiGet("/users/myInfo");
      dispatch(addName({ name: data.data.fullName }));
      if (data.data.role === "admin") dispatch(addIsAdmin({ isAdmin: true }));
      try {
        let questionsResp = await doApiGet("/questions/myInfo");
        if (questionsResp.data && questionsResp.data.length > 0) {
          setTests(questionsResp.data); setHasTests(true); dispatch(addIdQuestions({ idQuestions: questionsResp.data._id }));
        } else { setHasTests(false); }
      } catch (err) { setHasTests(false); }
    } catch (error) { console.log(error); }
  };

  // --- STYLES SYSTEM ---
  const styles = {
    // כרטיס קומפקטי יותר
    compactCard: {
        backgroundColor: "white",
        borderRadius: "16px", // מעט פחות עגול
        padding: "16px 20px", // פחות ריווח פנימי
        border: "1px solid #F3F4F6",
        boxShadow: "0 2px 10px -3px rgba(0,0,0,0.03)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
    },
    primaryBtn: {
        backgroundColor: ORANGE,
        color: "white",
        border: "none",
        padding: "10px 24px",
        borderRadius: "50px",
        fontSize: "0.9rem",
        fontWeight: "600",
        display: "flex", alignItems: "center", gap: "8px",
        boxShadow: "0 4px 12px rgba(249, 100, 36, 0.25)",
        transition: "all 0.2s ease"
    },
    // אייקון קטן יותר
    iconCircle: (color, bgColor) => ({
        width: "40px", height: "40px", // הוקטן
        borderRadius: "50%",
        backgroundColor: bgColor,
        color: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem"
    })
  };

  return (
    <>
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;700&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(0,0,0,0.05) !important; }
        .hover-row:hover { background-color: #FAFAFA; }
        `}
    </style>

    <div className="vh-100 d-flex flex-column font-inter text-dark overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>

      {/* --- HEADER --- */}
      <nav className="px-4 py-2 d-flex align-items-center justify-content-between bg-white" style={{ height: '65px', flexShrink: 0, borderBottom: '1px solid #F3F4F6' }}>
        <div className="d-flex align-items-center gap-3">
             <div className="d-flex align-items-center justify-content-center">
                <img src={logo} alt="Logo" width="26" />
             </div>
             <div className="d-flex flex-column justify-content-center">
                <span className="font-outfit fw-bold text-dark" style={{fontSize: '1.1rem', letterSpacing: '-0.5px'}}>Fitwave</span>
             </div>
        </div>

        <div className="d-flex align-items-center gap-4">
             <div className="d-none d-md-block text-end">
                <div className="font-outfit fw-bold text-dark" style={{fontSize: '0.9rem'}}>{myName}</div>
                <div className="text-muted" style={{fontSize: '0.7rem', fontWeight: '500'}}>Pro Account</div>
             </div>
             
             <div style={{ position: "relative" }} ref={menuRef}>
                <button 
                    onClick={toggleMenu}
                    className="bg-transparent border-0 d-flex align-items-center justify-content-center p-2 rounded-circle"
                    style={{ cursor: "pointer", transition: "background 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                    <BarsIcon />
                </button>
                {menuOpen && (
                    <div className="bg-white rounded-4 shadow-lg border border-light position-absolute end-0 mt-2 py-2 overflow-hidden animate__animated animate__fadeInUp animate__faster" style={{ width: "180px", zIndex: 100 }}>
                        {menuItems.filter(i => i.show).map((item, index) => (
                            <div key={index} onClick={() => { item.action(); setMenuOpen(false); }}
                                className="px-4 py-2 cursor-pointer hover-row fw-bold font-outfit"
                                style={{ fontSize: "0.85rem", color: "#374151" }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 container-fluid px-5 py-3 overflow-hidden d-flex flex-column" style={{ maxWidth: '1500px' }}>
        
        {/* Top Section Compact */}
        <div className="d-flex justify-content-between align-items-end mb-3 flex-shrink-0">
            <div>
                <h1 className="font-outfit mb-1" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111' }}>Dashboard</h1>
                <p className="text-muted m-0 font-inter" style={{ fontSize: '0.9rem', color: '#6B7280' }}>Overview</p>
            </div>
            {hasTests && (
                <button onClick={() => navigate("/explanatoryV")} style={styles.primaryBtn} className="hover-card">
                    <PlusIcon /> New Assessment
                </button>
            )}
        </div>

        {/* --- STATS CARDS (COMPACT) --- */}
        {hasTests && (
            <div className="row g-3 mb-3 flex-shrink-0">
                <div className="col-md-4">
                    <div style={styles.compactCard} className="hover-card">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase font-outfit" style={{letterSpacing: '0.5px', fontSize:'0.7rem'}}>Total</span>
                                <h2 className="font-outfit m-0 text-dark" style={{fontSize: '2rem', fontWeight: '700', lineHeight: 1.2}}>{tests.length}</h2>
                            </div>
                            <div style={styles.iconCircle('#374151', '#F3F4F6')}><ChartIcon /></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={styles.compactCard} className="hover-card">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase font-outfit" style={{letterSpacing: '0.5px', fontSize:'0.7rem'}}>Done</span>
                                <h2 className="font-outfit m-0" style={{fontSize: '2rem', fontWeight: '700', lineHeight: 1.2, color: '#059669'}}>{completedCount}</h2>
                            </div>
                            <div style={styles.iconCircle('#059669', '#ECFDF5')}><CheckCircle /></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={styles.compactCard} className="hover-card">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase font-outfit" style={{letterSpacing: '0.5px', fontSize:'0.7rem'}}>Pending</span>
                                <h2 className="font-outfit m-0" style={{fontSize: '2rem', fontWeight: '700', lineHeight: 1.2, color: ORANGE}}>{pendingCount}</h2>
                            </div>
                            <div style={styles.iconCircle(ORANGE, '#FFF7ED')}><ClockIcon /></div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- TABLE (EXPANDED) --- */}
        {/* הטבלה תופסת את כל הגובה שנשאר */}
        {hasTests ? (
            <div className="d-flex flex-column flex-grow-1 bg-white rounded-4 overflow-hidden border border-light shadow-sm mb-2">
                <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-white flex-shrink-0">
                    <h5 className="m-0 font-outfit fw-bold" style={{color: '#111', fontSize: '1rem'}}>Recent Assessments</h5>
                </div>
                
                <div className="flex-grow-1 overflow-auto"> 
                    <table className="w-100" style={{ borderCollapse: 'collapse' }}>
                        <thead className="bg-white sticky-top" style={{top: 0, zIndex: 10}}>
                            <tr>
                                <th className="px-5 py-3 text-start font-outfit text-muted small text-uppercase fw-bold" style={{letterSpacing: '1px', borderBottom: '1px solid #F3F4F6', backgroundColor:'white'}}>ID</th>
                                <th className="px-5 py-3 text-start font-outfit text-muted small text-uppercase fw-bold" style={{letterSpacing: '1px', borderBottom: '1px solid #F3F4F6', backgroundColor:'white'}}>Date</th>
                                <th className="px-5 py-3 text-start font-outfit text-muted small text-uppercase fw-bold" style={{letterSpacing: '1px', borderBottom: '1px solid #F3F4F6', backgroundColor:'white'}}>Status</th>
                                <th className="px-5 py-3 text-end font-outfit text-muted small text-uppercase fw-bold" style={{letterSpacing: '1px', borderBottom: '1px solid #F3F4F6', backgroundColor:'white'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test, index) => (
                                <tr key={test._id} className="hover-row" style={{ transition: 'background 0.2s', borderBottom: '1px solid #F9FAFB' }}>
                                    <td className="px-5 py-3 font-outfit fw-bold text-dark" style={{fontSize: '0.95rem'}}>#{index + 1}</td>
                                    <td className="px-5 py-3 font-inter text-secondary" style={{fontSize: '0.95rem'}}>{test.date_created.substring(0, 10)}</td>
                                    <td className="px-5 py-3">
                                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill" 
                                             style={{
                                                 backgroundColor: test.finished ? '#ECFDF5' : '#FFF7ED',
                                                 color: test.finished ? '#059669' : ORANGE,
                                                 fontSize: '0.75rem', fontWeight: '700', fontFamily: 'Outfit'
                                             }}>
                                            {test.finished ? "COMPLETED" : "IN PROGRESS"}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-end">
                                        {test.finished ? (
                                            <button 
                                                onClick={() => { dispatch(addIdQuestions({ idQuestions: test._id })); navigate(`/outCome`); }}
                                                className="btn btn-link text-decoration-none text-muted font-inter fw-bold"
                                                style={{fontSize: '0.9rem'}}
                                            >
                                                View Report
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => { dispatch(addIdQuestions({ idQuestions: test._id })); if (test.finishedT1) navigate(`/calibration`); else navigate(`/HealthForm`); }}
                                                className="btn btn-sm rounded-pill text-white px-4 py-1 font-outfit fw-bold hover-card"
                                                style={{ backgroundColor: ORANGE, border: 'none', boxShadow: `0 4px 10px rgba(249, 100, 36, 0.3)`, fontSize: '0.85rem' }}
                                            >
                                                Continue
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-white rounded-4 border border-light shadow-sm">
                 <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle" style={{width: '70px', height: '70px', background: '#FFF7ED'}}>
                    <PlusIcon stroke={ORANGE} width="28" height="28" />
                 </div>
                 <h2 className="font-outfit fw-bold mb-2">No assessments found</h2>
                 <p className="text-muted mb-4 text-center font-inter" style={{ maxWidth: '400px' }}>
                    Launch your first biomechanical analysis to see data here.
                 </p>
                 <button style={styles.primaryBtn} onClick={() => navigate("/explanatoryV")}>
                    Start First Test
                 </button>
            </div>
        )}

      </div>
    </div>
    </>
  );
};

export default HomeClient;