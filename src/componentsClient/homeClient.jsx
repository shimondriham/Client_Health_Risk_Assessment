import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../assets/react.svg'; 

// --- Icons ---
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CheckCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

const HomeClient = () => {
  const _tests = [
    { _id: 1, date_created: "2025-01-22T10:00:00", finished: true, finishedT1: true },
    { _id: 2, date_created: "2025-01-20T14:30:00", finished: false, finishedT1: false },
    { _id: 3, date_created: "2025-01-18T09:15:00", finished: false, finishedT1: true },
    { _id: 4, date_created: "2025-01-15T09:15:00", finished: true, finishedT1: true },
    { _id: 5, date_created: "2025-01-12T09:15:00", finished: true, finishedT1: true },
  ];

  const myName = useSelector(state => state.myDetailsSlice.name);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [tests, setTests] = useState(_tests);
  const [hasTests, setHasTests] = useState(true);

  // Stats
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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
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
          setTests(questionsResp.data);
          setHasTests(true);
          dispatch(addIdQuestions({ idQuestions: questionsResp.data._id }));
        } else { setHasTests(false); }
      } catch (err) { setHasTests(false); }
    } catch (error) { console.log(error); }
  };

  // --- Styles ---
  const styles = {
    statCard: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "16px",
        border: "1px solid #F3F4F6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%"
    },
    th: {
        backgroundColor: "#F9FAFB",
        padding: "12px 24px",
        textAlign: "left",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 10
    },
    td: {
        padding: "12px 24px",
        borderBottom: "1px solid #F3F4F6",
        fontSize: "0.9rem",
        color: "#374151"
    },
    statusBadge: (finished) => ({
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "500",
        backgroundColor: finished ? "#ECFDF5" : "#FFFBEB",
        color: finished ? "#065F46" : "#B45309"
    }),
    dropdown: {
        position: "absolute", top: "50px", right: 0,
        backgroundColor: "white", borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #E5E7EB", width: "160px", overflow: "hidden", zIndex: 50
    }
  };

  return (
    // מיכל ראשי - ללא גלילה (vh-100, overflow-hidden)
    <div className="vh-100 bg-light d-flex flex-column font-sans text-dark overflow-hidden">

      {/* 1. Header (גובה קבוע) */}
      <nav className="d-flex align-items-center justify-content-between px-4" style={{ height: '60px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="22" />
            <span className="fw-bold fst-italic" style={{fontSize: '1rem'}}>Fitwave.ai</span>
        </div>

        <div className="d-flex align-items-center gap-3">
             <div className="d-none d-md-block text-end">
                <div style={{fontSize: '0.85rem', fontWeight: '600'}}>{myName}</div>
                <div style={{fontSize: '0.7rem', color: '#6B7280'}}>User Account</div>
             </div>
             
             <div style={{ position: "relative" }} ref={menuRef}>
                <button 
                    onClick={toggleMenu}
                    style={{
                        background: menuOpen ? "#F3F4F6" : "transparent",
                        border: "1px solid #E5E7EB", borderRadius: "50%",
                        width: "36px", height: "36px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#374151"
                    }}
                >
                    {menuOpen ? <MenuIcon /> : <UserIcon />}
                </button>
                {menuOpen && (
                    <div style={styles.dropdown}>
                        {menuItems.filter(i => i.show).map((item, index) => (
                            <div key={index} onClick={() => { item.action(); setMenuOpen(false); }}
                                style={{ padding: "10px 16px", cursor: "pointer", fontSize: "0.85rem" }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.color = ORANGE; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#374151"; }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </nav>

      {/* 2. Main Content Wrapper - Flex Grow */}
      {/* זה החלק שתופס את כל הגובה שנשאר ומונע גלילה חיצונית */}
      <div className="flex-grow-1 d-flex flex-column p-4 overflow-hidden container" style={{ maxWidth: '1000px' }}>
        
        {/* Title Section (קבוע) */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
            <div>
                <h1 className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Dashboard</h1>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>Assessment overview</p>
            </div>
            {hasTests && (
                <button 
                    onClick={() => navigate("/explanatoryV")}
                    className="btn text-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    style={{ backgroundColor: ORANGE, fontWeight: '500', fontSize: '0.85rem', border: 'none' }}
                >
                    <PlusIcon /> New Assessment
                </button>
            )}
        </div>

        {/* Stats Row (קבוע) */}
        {hasTests && (
            <div className="row g-3 mb-4 flex-shrink-0">
                <div className="col-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>{tests.length}</span>
                    </div>
                </div>
                <div className="col-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Completed</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>{completedCount}</span>
                    </div>
                </div>
                <div className="col-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Pending</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F59E0B' }}>{pendingCount}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Table Section (תופס את הגובה הנותר ונגלל פנימית) */}
        {hasTests ? (
            <div className="d-flex flex-column flex-grow-1 bg-white rounded-4 border shadow-sm overflow-hidden">
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white flex-shrink-0">
                    <h5 className="m-0 fw-bold" style={{color: '#111', fontSize: '1rem'}}>Recent History</h5>
                </div>
                
                {/* אזור הגלילה הפנימי */}
                <div className="flex-grow-1 overflow-auto"> 
                    <table className="w-100" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{...styles.th, paddingLeft: '32px'}}>ID</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test, index) => (
                                <tr key={test._id} className="hover-bg-gray">
                                    <td style={{...styles.td, paddingLeft: '32px', fontWeight: '500'}}>#{index + 1}</td>
                                    <td style={styles.td}>{test.date_created.substring(0, 10)}</td>
                                    <td style={styles.td}>
                                        <div style={styles.statusBadge(test.finished)}>
                                            {test.finished ? <CheckCircle /> : <ClockIcon />}
                                            {test.finished ? "Completed" : "In Progress"}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        {test.finished ? (
                                            <button 
                                                onClick={() => {
                                                    dispatch(addIdQuestions({ idQuestions: test._id }));
                                                    navigate(`/outCome`);
                                                }}
                                                style={{ background: 'transparent', border: 'none', color: '#6B7280', fontWeight: '500', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                View Report
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    dispatch(addIdQuestions({ idQuestions: test._id }));
                                                    if (test.finishedT1) navigate(`/calibration`);
                                                    else navigate(`/HealthForm`);
                                                }}
                                                className="btn btn-sm rounded-pill text-white px-3"
                                                style={{ backgroundColor: ORANGE, border: 'none', fontWeight: '500', fontSize: '0.8rem' }}
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
            /* Empty State */
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-white rounded-4 border shadow-sm">
                 <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{width: '64px', height: '64px'}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                 </div>
                 <h4 className="fw-bold mb-2">No assessments yet</h4>
                 <p className="text-muted mb-4 text-center" style={{ maxWidth: '400px' }}>
                    Get started with your first biomechanical analysis to receive your personalized insights.
                 </p>
                 <button
                    className="btn text-white px-5 py-2 rounded-pill shadow-sm"
                    style={{ backgroundColor: ORANGE, fontWeight: '500', border: 'none' }}
                    onClick={() => navigate("/explanatoryV")}
                 >
                    Start First Test
                 </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default HomeClient;