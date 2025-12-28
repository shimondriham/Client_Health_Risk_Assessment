import React, { useEffect, useState } from 'react';
import { doApiGet } from '../services/apiService';
import { reverse } from 'lodash';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addIdMorInfoAdmin } from '../featuers/myDetailsSlice';
import reactIcon from '../assets/react.svg';

// --- Icons ---
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const UserIconWhite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const Spinner = () => <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" style={{animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="#eee" strokeWidth="4"></circle><path fill="#F96424" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>;

const initialUsers = [];

const DashboardAdmin = () => {
  let nav = useNavigate();
  let [ar, setAr] = useState(initialUsers);
  let [ar2, setAr2] = useState([]); // Backup for filtering
  let [searchText, setSearchText] = useState("");
  let [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const ORANGE = "#F96424";

  useEffect(() => {
    doApi()
  }, [])

  const doApi = async () => {
    let url = "/users"
    try {
      let resData = await doApiGet(url);
      let data = resData.data;
      reverse(data);
      setAr(data);
      setAr2(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const onSearchClick = () => {
    if (!searchText) {
        setAr(ar2);
        return;
    }
    const filtered = ar2.filter(user => 
        user.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setAr(filtered);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        onSearchClick();
    }
  }

  const toAdmin2 = (id) => {
    dispatch(addIdMorInfoAdmin({ idMorInfoAdmin: id }));
    nav("/admin/admin222");
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
    // Search Bar Styles
    searchContainer: {
        display: 'flex', gap: '10px', alignItems: 'center',
        maxWidth: '500px', width: '100%',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '50px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid #eee'
    },
    searchInput: {
        border: 'none', outline: 'none',
        padding: '10px 15px', flexGrow: 1,
        fontSize: '1rem', color: '#333',
        borderRadius: '50px'
    },
    searchBtn: {
        backgroundColor: ORANGE, color: 'white',
        border: 'none', borderRadius: '50%',
        width: '42px', height: '42px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s'
    },
    // Table Styles
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        width: '100%'
    },
    tableHeader: {
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        color: '#6B7280',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: '0.05em',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 10
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
    roleBadge: (role) => {
        const isAdmin = role?.toLowerCase() === 'admin';
        return {
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: '600',
            backgroundColor: isAdmin ? '#FFF7ED' : '#F3F4F6',
            color: isAdmin ? '#EA580C' : '#4B5563',
            border: isAdmin ? '1px solid #FFEDD5' : '1px solid #E5E7EB'
        }
    },
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

  return (
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">
        
        <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 10px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #F1F1F1; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #A0A0A0; border-radius: 10px; border: 2px solid #F1F1F1; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #707070; }
            .hover-bg-light:hover { background-color: #fafafa; }
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

        {/* Navbar */}
        <nav className="d-flex align-items-center px-4 py-3 flex-shrink-0 justify-content-between border-bottom">
            <div className="d-flex align-items-center gap-2">
                <img src={reactIcon} alt="Logo" width="22" className="opacity-75" />
                <span className="logo-text" style={{ fontSize: '1.8rem' }}>Fitwave.ai <span style={{fontSize:'0.9rem', color:'#999', fontWeight:'normal'}}>| Admin</span></span>
            </div>
        </nav>

        {/* Header Orange */}
        <div style={styles.fullWidthHeader}>
            <div style={styles.headerContent}>
                <div className="text-uppercase fw-bold text-white-50 small mb-1" style={{letterSpacing: '1.5px', fontSize:'0.75rem'}}>Dashboard</div>
                <h1 className="fw-bold mb-0 font-outfit text-white" style={{ fontSize: '2.2rem' }}>
                    User Management
                </h1>
                <div className="d-flex align-items-center gap-2 mt-2 text-white-50" style={{fontSize: '0.95rem'}}>
                     <UserIconWhite /> <span>Total Users: {ar2.length}</span>
                </div>
            </div>
        </div>

        {/* Main Content - שיניתי כאן מ-bg-light ל-bg-white */}
        <div className="flex-grow-1 d-flex justify-content-center w-100 bg-white overflow-hidden">
            <div className="w-100 h-100 d-flex flex-column p-4" style={{ maxWidth: '1000px' }}>
                
                {/* Search & Actions Bar */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3 flex-shrink-0">
                    <h3 className="mb-0 font-outfit fw-bold text-dark align-self-start align-self-md-center">Users List</h3>
                    
                    <div style={styles.searchContainer}>
                        <input 
                            type="text" 
                            style={styles.searchInput} 
                            placeholder="Search by name or email..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button 
                            style={styles.searchBtn} 
                            onClick={onSearchClick}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <SearchIcon />
                        </button>
                    </div>
                </div>
                
                {/* Table Area (Scrollable) */}
                <div className="flex-grow-1 overflow-hidden d-flex flex-column">
                    <div className="custom-scrollbar" style={{ overflowY: 'auto', flexGrow: 1, borderRadius: '16px' }}>
                        <div style={styles.tableContainer}>
                            {loading ? (
                                <div className="p-5 text-center">
                                    <Spinner />
                                    <div className="mt-3 text-muted">Loading users...</div>
                                </div>
                            ) : (
                                <table className="w-100" style={{borderCollapse: 'collapse'}}>
                                    <thead>
                                        <tr>
                                            <th style={styles.tableHeader}>#</th>
                                            <th style={styles.tableHeader}>Full Name</th>
                                            <th style={styles.tableHeader}>Email Address</th>
                                            <th style={styles.tableHeader}>Role</th>
                                            <th style={{...styles.tableHeader, textAlign: 'right'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ar.length > 0 ? ar.map((user, index) => (
                                            <tr key={user._id || index} style={styles.tableRow} className="hover-bg-light">
                                                <td style={styles.tableCell} className="fw-bold text-muted text-center" width="60">{index + 1}</td>
                                                
                                                <td style={styles.tableCell} className="fw-bold text-dark">
                                                    {user.fullName}
                                                </td>
                                                
                                                <td style={styles.tableCell} className="text-secondary">
                                                    {user.email}
                                                </td>
                                                
                                                <td style={styles.tableCell}>
                                                    <span style={styles.roleBadge(user.role)}>
                                                        {user.role?.toLowerCase() === 'admin' && <ShieldIcon />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                
                                                <td style={{...styles.tableCell, textAlign: 'right'}}>
                                                    <button
                                                        style={styles.actionBtn}
                                                        onClick={() => toAdmin2(user._id)}
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
                                                        title="View Details"
                                                    >
                                                        <ArrowRightIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center p-5 text-muted">
                                                    No users found matching "{searchText}".
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div style={{height: '20px'}}></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default DashboardAdmin;