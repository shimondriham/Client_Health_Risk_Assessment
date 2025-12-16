import React, { useEffect, useState ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBars } from "react-icons/fa";

const HomeClient = () => {
  // --- Mock Data for styling ---
  const _tests = [
    { _id: 1, date_created: "2025-01-22T10:00:00", finished: true, finishedT1: true },
    { _id: 2, date_created: "2025-01-20T14:30:00", finished: false, finishedT1: false },
    { _id: 3, date_created: "2025-01-18T09:15:00", finished: false, finishedT1: true },
  ];

  const myName = useSelector(state => state.myDetailsSlice.name);
  const IfShowNav = useSelector(state => state.myDetailsSlice.ifShowNav);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [tests, setTests] = useState(_tests);
  const [hasTests, setHasTests] = useState(true);

  // Stats counters
  const completedCount = tests.filter(t => t.finished).length;
  const pendingCount = tests.length - completedCount;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    dispatch(addIdQuestions({ idQuestions: "0" }));
    fetchUserData();
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
  }, []);
  const menuItems = [
    { label: "Logout", action: () => onlogout() },
    { label: "Admin", action: () => Admin() },

  ];
  const Admin = () => navigate("/admin");
  const onlogout = () => { dispatch(addIfShowNav({ ifShowNav: false })); navigate("/logout"); }

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
        } else {
          setHasTests(false);
        }
      } catch (err) {
        setHasTests(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // --- Styles ---
  const styles = {
    pageContainer: {
      backgroundColor: "#f4f6f8", // Very light clean gray
      minHeight: "100vh",
      paddingBottom: "4rem"
    },
    header: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #eaeaea",
      padding: "1.5rem 0"
    },
    statCard: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      border: "1px solid #eee",
      padding: "1.5rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    tableHeader: {
      textTransform: "uppercase",
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#8898aa",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #eee",
      paddingBottom: "1rem"
    },
    tableRow: {
      transition: "background-color 0.2s",
      cursor: "pointer",
      borderBottom: "1px solid #f5f5f5"
    },
    primaryBtn: {
      background: "#0d6efd", // Keep simple blue or use brand color
      border: "none",
      padding: "10px 24px",
      borderRadius: "8px",
      fontWeight: "500",
      fontSize: "0.95rem"
    }
  };

  // Helper for Status UI
  const StatusIndicator = ({ finished }) => {
    const color = finished ? "#2dce89" : "#fb6340"; // Green or Orange
    const label = finished ? "Completed" : "In Progress";

    return (
      <div className="d-flex align-items-center">
        <span style={{
          height: '8px', width: '8px', borderRadius: '50%',
          backgroundColor: color, marginRight: '8px', display: 'inline-block'
        }}></span>
        <span style={{ color: '#525f7f', fontSize: '0.9rem' }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={styles.pageContainer}>

      {/* 1. Header Section */}
      <header className='d-flex align-items-center px-4' style={styles.header}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold text-dark m-0">Dashboard</h4>
            <p className="text-muted small m-0 mt-1">Overview of your biomechanical assessments</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <span className="d-block fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{myName}</span>
              <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>User Account</span>
            </div>
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person text-secondary"></i>
            </div>
          </div>
        </div>
        <div>
          {IfShowNav && IsAdmin &&
            <div style={{ position: "relative" }} ref={menuRef}>
              <FaBars size={32} className="m-1" style={{ cursor: "pointer" }} onClick={toggleMenu} />

              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  width: "90px",
                  overflow: "hidden",
                  borderRadius: "4px",
                  zIndex: 100,
                  padding: "10px",
                  backgroundColor: "transparent",
                }}
              >
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={item.action}
                    style={{
                      padding: "8px 0",
                      cursor: "pointer",
                      transform: menuOpen ? "translateX(0) scale(1)" : "translateX(50px) scale(0.9)",
                      opacity: menuOpen ? 1 : 0,
                      transition: `all 0.3s ease ${(index + 1) * 0.1}s`,
                      borderRadius: "4px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#d0eaff";
                      e.currentTarget.style.color = "#007bff";
                      e.currentTarget.style.transform = "translateX(0) scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "black";
                      e.currentTarget.style.transform = "translateX(0) scale(1)";
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      </header>

      <div className="container mt-5">

        {/* 2. Top Stats Row (Adds Professional Feel) */}
        {hasTests && (
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div style={styles.statCard} className="shadow-sm">
                <span className="text-uppercase text-muted small fw-bold mb-2">Total Assessments</span>
                <h2 className="fw-bold text-dark m-0">{tests.length}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div style={styles.statCard} className="shadow-sm">
                <span className="text-uppercase text-muted small fw-bold mb-2">Completed</span>
                <h2 className="fw-bold text-success m-0">{completedCount}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div style={styles.statCard} className="shadow-sm">
                <span className="text-uppercase text-muted small fw-bold mb-2">Pending Action</span>
                <h2 className="fw-bold text-warning m-0">{pendingCount}</h2>
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Content Area */}
        <div className="bg-white rounded-3 shadow-sm border border-light overflow-hidden">

          {/* Table Toolbar */}
          <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-light">
            <h5 className="fw-bold m-0 text-dark">Recent Assessments</h5>
            <button
              className="btn btn-primary shadow-sm"
              style={styles.primaryBtn}
              onClick={() => navigate("/explanatoryV")}
            >
              + New Assessment
            </button>
          </div>

          {/* Table or Empty State */}
          {hasTests ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th style={{ ...styles.tableHeader, paddingLeft: '1.5rem' }}>ID</th>
                    <th style={styles.tableHeader}>Date Created</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}></th> {/* Actions column */}
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr key={test._id} style={{ height: '70px' }}>
                      <td className="ps-4 fw-bold text-dark">#{index + 1}</td>
                      <td className="text-muted">
                        {test.date_created.substring(0, 10)}
                      </td>
                      <td>
                        <StatusIndicator finished={test.finished} />
                      </td>
                      <td className="text-end pe-4">
                        {test.finished ? (
                          <button
                            className="btn btn-link text-decoration-none fw-bold small text-primary"
                            onClick={() => {
                              dispatch(addIdQuestions({ idQuestions: test._id }));
                              navigate(`/outCome`);
                            }}
                          >
                            View Report
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold"
                            onClick={() => {
                              dispatch(addIdQuestions({ idQuestions: test._id }));
                              if (test.finishedT1) navigate(`/calibration`);
                              else navigate(`/HealthForm`);
                            }}
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
          ) : (
            /* Professional Empty State */
            <div className="text-center py-5">
              <div className="mb-3 p-3 d-inline-block bg-light rounded-circle">
                <i className="bi bi-clipboard-data text-secondary fs-1"></i>
              </div>
              <h4 className="fw-bold text-dark">No assessments found</h4>
              <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                Get started with your first biomechanical analysis to receive your personalized medical insights.
              </p>
              <button
                className="btn btn-primary px-4 py-2 fw-bold"
                onClick={() => navigate("/explanatoryV")}
              >
                Start First Test
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomeClient;