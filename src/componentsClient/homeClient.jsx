import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../assets/react.svg'; 

// --- Icons ---
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CheckCircle = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
// אייקון המבורגר (כמו FaBars)
const BarsIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const HomeClient = () => {
  // נתוני דמה לבדיקה
  const _tests = [
    { _id: 1, date_created: "2025-01-22T10:00:00", finished: true, finishedT1: true },
    { _id: 2, date_created: "2025-01-20T14:30:00", finished: false, finishedT1: false },
    { _id: 3, date_created: "2025-01-18T09:15:00", finished: false, finishedT1: true },
    { _id: 4, date_created: "2025-01-15T09:15:00", finished: true, finishedT1: true },
  ];

  const myName = useSelector(state => state.myDetailsSlice.name);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [tests, setTests] = useState(_tests);
  const [hasTests, setHasTests] = useState(true);

  // סטטיסטיקות
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
        padding: "20px",
        border: "1px solid #F3F4F6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        height: "100%"
    },
    th: {
        backgroundColor: "#F9FAFB",
        padding: "16px 24px",
        textAlign: "left",
        fontSize: "0.8rem",
        fontWeight: "700", // פונט עבה לכותרות
        color: "#4B5563",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "2px solid #E5E7EB",
        position: "sticky", top: 0, zIndex: 10
    },
    td: {
        padding: "16px 24px",
        borderBottom: "1px solid #F3F4F6",
        fontSize: "0.95rem",
        fontWeight: "500", // פונט בינוני לתוכן
        color: "#374151"
    },
    statusBadge: (finished) => ({
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "6px 12px", borderRadius: "30px", fontSize: "0.85rem", fontWeight: "600",
        backgroundColor: finished ? "#ECFDF5" : "#FFFBEB",
        color: finished ? "#065F46" : "#B45309"
    }),
    dropdown: {
        position: "absolute", top: "55px", right: 0,
        backgroundColor: "white", borderRadius: "12px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        border: "1px solid #E5E7EB", width: "180px", overflow: "hidden", zIndex: 100
    }
  };

  return (
    // מיכל ראשי - ללא גלילה (vh-100, overflow-hidden)
    <div className="vh-100 bg-light d-flex flex-column font-sans text-dark overflow-hidden">

      {/* 1. Header (גובה קבוע) */}
      <nav className="d-flex align-items-center justify-content-between px-4" style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        
        {/* צד שמאל: לוגו */}
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="26" />
            <span className="fw-bold fst-italic" style={{fontSize: '1.2rem', color: '#111'}}>Fitwave.ai</span>
        </div>

        {/* צד ימין: משתמש + תפריט המבורגר */}
        <div className="d-flex align-items-center gap-4">
             {/* פרטי משתמש */}
             <div className="d-none d-md-block text-end">
                <div style={{fontSize: '0.95rem', fontWeight: '700', color: '#111'}}>{myName}</div>
                <div style={{fontSize: '0.8rem', color: '#6B7280', fontWeight: '500'}}>User Account</div>
             </div>
             
             {/* כפתור תפריט (המבורגר) */}
             <div style={{ position: "relative" }} ref={menuRef}>
                <button 
                    onClick={toggleMenu}
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.7"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                    <BarsIcon />
                </button>

                {/* דרופ-דאון שנפתח מצד ימין */}
                {menuOpen && (
                    <div style={styles.dropdown} className="animate__animated animate__fadeIn animate__faster">
                        {menuItems.filter(i => i.show).map((item, index) => (
                            <div key={index} onClick={() => { item.action(); setMenuOpen(false); }}
                                style={{ padding: "12px 20px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500" }}
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
      {/* תופס את כל הגובה הנותר ומונע גלילה חיצונית */}
      <div className="flex-grow-1 d-flex flex-column p-4 overflow-hidden container" style={{ maxWidth: '1100px' }}>
        
        {/* Title Section (קבוע) */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
            <div>
                <h1 className="mb-1" style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111' }}>Dashboard</h1>
                <p className="text-muted m-0" style={{ fontSize: '1rem', fontWeight: '500' }}>Assessment overview</p>
            </div>
            {hasTests && (
                <button 
                    onClick={() => navigate("/explanatoryV")}
                    className="btn text-white px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    style={{ backgroundColor: ORANGE, fontWeight: '600', fontSize: '0.95rem', border: 'none' }}
                >
                    <PlusIcon /> New Assessment
                </button>
            )}
        </div>

        {/* Stats Row (קבוע) */}
        {hasTests && (
            <div className="row g-4 mb-4 flex-shrink-0">
                <div className="col-md-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontSize: '2rem', fontWeight: '800', color: '#111' }}>{tests.length}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' }}>Completed</span>
                        <span style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981' }}>{completedCount}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={styles.statCard}>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' }}>Pending</span>
                        <span style={{ fontSize: '2rem', fontWeight: '800', color: '#F59E0B' }}>{pendingCount}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Table Section (תופס את הגובה הנותר ונגלל פנימית) */}
        {hasTests ? (
            <div className="d-flex flex-column flex-grow-1 bg-white rounded-4 border shadow-sm overflow-hidden">
                <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-white flex-shrink-0">
                    <h5 className="m-0 fw-bold" style={{color: '#111', fontSize: '1.1rem'}}>Recent History</h5>
                </div>
                
                {/* אזור הגלילה הפנימי של הטבלה */}
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
                                <tr key={test._id} style={{ transition: 'background 0.2s' }} className="hover-bg-gray">
                                    <td style={{...styles.td, paddingLeft: '32px', fontWeight: '600'}}>#{index + 1}</td>
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
                                                style={{ background: 'transparent', border: 'none', color: '#6B7280', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}
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
                                                className="btn btn-sm rounded-pill text-white px-4"
                                                style={{ backgroundColor: ORANGE, border: 'none', fontWeight: '600', fontSize: '0.9rem' }}
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
                 <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{width: '70px', height: '70px'}}>
                    <PlusIcon />
                 </div>
                 <h3 className="fw-bold mb-2 text-dark">No assessments yet</h3>
                 <p className="text-muted mb-4 text-center" style={{ maxWidth: '400px', fontSize: '1rem', fontWeight: '500' }}>
                    Get started with your first biomechanical analysis to receive your personalized insights.
                 </p>
                 <button
                    className="btn text-white px-5 py-3 rounded-pill shadow-sm"
                    style={{ backgroundColor: ORANGE, fontWeight: '600', border: 'none', fontSize: '1rem' }}
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