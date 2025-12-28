import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doApiGet } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { addIdOutComeAdmin } from "../featuers/myDetailsSlice";
import reactIcon from '../assets/react.svg'; 

// --- Icons ---
const ArrowLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UserIconWhite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CheckCircleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const Spinner = () => <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" style={{animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="#eee" strokeWidth="4"></circle><path fill="#F96424" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>;

function DashboardAdmin222() {
  let nav = useNavigate();
  const initialUsers = []; // התחלתי עם מערך ריק כדי למנוע הבהוב לפני הטעינה

  let [ar, setAr] = useState(initialUsers);
  const ThisID = useSelector((state) => state.myDetailsSlice.idMorInfoAdmin);
  const [thisUser, setThisUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  const ORANGE = "#F96424"; 

  useEffect(() => {
    const fetchData = async () => {
        await doApiUsers();
        await doApiQuestions();
        setLoading(false);
    };
    fetchData();
  }, []);

  const doApiUsers = async () => {
    let url = "/users/single/" + ThisID;
    try {
      let data = await doApiGet(url);
      setThisUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const doApiQuestions = async () => {
    let url = "/questions/selectedUser/" + ThisID;
    try {
      let data = await doApiGet(url);
      setAr(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toOutCome = (id) => {
    dispatch(addIdOutComeAdmin({ idOutComeAdmin: id }));
    nav("/admin/outcomeadmin");
  };

  // --- Styles ---
  const styles = {
    fullWidthHeader: {
        background: `linear-gradient(135deg, ${ORANGE} 0%, #FF7F45 100%)`, 
        width: '100%',
        padding: '40px 0',
        flexShrink: 0,
        boxShadow: '0 4px 20px rgba(249, 100, 36, 0.15)'
    },
    headerContent: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
    },
    exitButton: {
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "50px",
        padding: "8px 20px",
        color: "#6B7280",
        fontWeight: "600",
        fontSize: "0.9rem",
        display: "flex", alignItems: "center", gap: '8px',
        cursor: "pointer",
        transition: "all 0.2s ease"
    },
    // Table Styles
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden'
    },
    tableHeader: {
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        color: '#6B7280',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: '0.05em',
        padding: '16px 24px'
    },
    tableRow: {
        borderBottom: '1px solid #F3F4F6',
        transition: 'background-color 0.1s'
    },
    tableCell: {
        padding: '20px 24px',
        fontSize: '0.95rem',
        color: '#1F2937',
        verticalAlign: 'middle'
    },
    statusBadge: (isFinished) => ({
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px',
        borderRadius: '50px',
        fontSize: '0.85rem',
        fontWeight: '600',
        backgroundColor: isFinished ? '#ECFDF5' : '#F3F4F6',
        color: isFinished ? '#059669' : '#6B7280'
    }),
    actionBtn: {
        backgroundColor: 'white',
        border: '1px solid #E5E7EB',
        width: '40px', height: '40px',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: ORANGE,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }
  };

  // פורמט תאריך נקי
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    // מניח שזה תאריך סטנדרטי, אם זה סטרינג מוזר ננסה לנקות אותו
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    } catch (e) {
        return dateString.substring(0, 10);
    }
  };

  return (
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">
        
        {/* Navbar */}
        <nav className="d-flex align-items-center px-4 py-3 flex-shrink-0 justify-content-between border-bottom">
            <div className="d-flex align-items-center gap-2">
                <img src={reactIcon} alt="Logo" width="22" className="opacity-75" />
                <span className="logo-text" style={{ fontSize: '1.8rem' }}>Fitwave.ai <span style={{fontSize:'0.9rem', color:'#999', fontWeight:'normal'}}>| Admin</span></span>
            </div>
            
            <button 
                onClick={() => nav("/admin")} 
                style={styles.exitButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
                <ArrowLeftIcon /> Back to Dashboard
            </button>
        </nav>

        {/* Header Orange */}
        <div style={styles.fullWidthHeader}>
            <div style={styles.headerContent}>
                <div className="text-uppercase fw-bold text-white-50 small mb-1" style={{letterSpacing: '1.5px', fontSize:'0.75rem'}}>Client Profile</div>
                <h1 className="fw-bold mb-0 font-outfit text-white" style={{ fontSize: '2.2rem' }}>
                    {thisUser ? thisUser.fullName : "Loading..."}
                </h1>
                {thisUser && (
                    <div className="d-flex align-items-center gap-2 mt-2 text-white-50" style={{fontSize: '0.95rem'}}>
                         <UserIconWhite /> <span>Client Details & History</span>
                    </div>
                )}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 d-flex justify-content-center w-100 overflow-hidden bg-light">
            <div className="w-100 h-100 d-flex flex-column p-4" style={{ maxWidth: '1000px', overflowY: 'auto' }}>
                
                <h3 className="mb-3 font-outfit fw-bold text-dark">Assessments History</h3>
                
                <div style={styles.tableContainer}>
                    {loading ? (
                        <div className="p-5 text-center">
                            <Spinner />
                            <div className="mt-3 text-muted">Loading assessments...</div>
                        </div>
                    ) : (
                        <table className="w-100" style={{borderCollapse: 'collapse'}}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>#</th>
                                    <th style={styles.tableHeader}>Date Created</th>
                                    <th style={styles.tableHeader}>First Assessment</th>
                                    <th style={styles.tableHeader}>Second Assessment</th>
                                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ar.length > 0 ? ar.map((item, index) => (
                                    <tr key={index} style={styles.tableRow} className="hover-bg-light">
                                        <td style={styles.tableCell} className="fw-bold text-muted">{index + 1}</td>
                                        
                                        <td style={styles.tableCell} className="fw-medium">
                                            {formatDate(item.date_created)}
                                        </td>
                                        
                                        <td style={styles.tableCell}>
                                            <span style={styles.statusBadge(item.finishedT1)}>
                                                {item.finishedT1 ? <CheckCircleIcon /> : <ClockIcon />}
                                                {item.finishedT1 ? "Completed" : "Pending"}
                                            </span>
                                        </td>
                                        
                                        <td style={styles.tableCell}>
                                            <span style={styles.statusBadge(item.finished)}>
                                                {item.finished ? <CheckCircleIcon /> : <ClockIcon />}
                                                {item.finished ? "Completed" : "Pending"}
                                            </span>
                                        </td>
                                        
                                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                                            <button
                                                style={styles.actionBtn}
                                                onClick={() => toOutCome(item._id)}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = ORANGE;
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.transform = 'scale(1.1)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'white';
                                                    e.currentTarget.style.color = ORANGE;
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                                title="View Report"
                                            >
                                                <ArrowRightIcon />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-5 text-muted">
                                            No assessments found for this client.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>

        {/* Global CSS for hover effects */}
        <style>{`
            .hover-bg-light:hover {
                background-color: #fafafa;
            }
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
  );
}

export default DashboardAdmin222;