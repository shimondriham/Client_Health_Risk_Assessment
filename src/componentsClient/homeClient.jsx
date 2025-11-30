// ==================== HomeClient.jsx ====================
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";

const HomeClient = () => {
const myName = useSelector(state => state.myDetailsSlice.name);
const idQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
const navigate = useNavigate();
const [myInfo, setmyInfo] = useState({});
const [hasTests, setHasTests] = useState(false);
const [nextSection, setNextSection] = useState(null);
const dispatch = useDispatch();

const tests = [
{ id: 1, date: "22 Jan 2025", status: "Completed" },
{ id: 2, date: "20 Jan 2025", status: "Incomplete" },
];

const getStatusBadge = (status) => {
const colors = { Completed: "success", Incomplete: "danger" };
return <span className={`badge bg-${colors[status]}`}>{status}</span>;
};

useEffect(() => {
dispatch(addIfShowNav({ ifShowNav: true }));
fetchUserData();
}, []);

const fetchUserData = async () => {
try {
let data = await doApiGet("/users/myInfo");
setmyInfo(data.data);
dispatch(addName({ name: data.data.fullName }));
if (data.data.role === "admin") dispatch(addIsAdmin({ isAdmin: true }));


  try {
    let questionsResp = await doApiGet("/questions/myInfo");
    if (questionsResp.data) {
      setHasTests(true);
      dispatch(addIdQuestions({ idQuestions: questionsResp.data._id }));

      const sections = ["section1","section2","section3","section4"];
      const finishedSections = sections.map(s => questionsResp.data[s]);
      const nextIdx = finishedSections.indexOf(undefined);
      setNextSection(nextIdx === -1 ? null : nextIdx);
    }
  } catch (err) {
    console.log("No previous questions found");
  }
} catch (error) {
  console.log(error);
}


};

const downloadReport = (testId) => {
const doc = new jsPDF();
doc.setFontSize(22);
doc.text("Test Report", 10, 20);
doc.setFontSize(14);
doc.text(`Report for test ID: ${testId}`, 10, 40);
doc.text("Status: Completed", 10, 55);
doc.text("Date: 22 Jan 2025", 10, 70);
doc.text("More details here...", 10, 90);
doc.save(`test_${testId}_report.pdf`);
};

return ( <div className="container py-5"> <h2 className="text-center mb-5">
Welcome {hasTests ? "Back " : ""}{myName || "User"}! </h2>


  <div className="row">
    {hasTests ? (
      <>
        <div className="col-md-7">
          <table className="table table-hover shadow-sm rounded overflow-hidden">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>{test.id}</td>
                  <td>{test.date}</td>
                  <td>{getStatusBadge(test.status)}</td>
                  <td>
                    {test.status === "Completed" && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => downloadReport(test.id)}
                      >
                        Download Report
                      </button>
                    )}
                    {test.status === "Incomplete" && nextSection !== null && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/HealthForm`)}
                      >
                        Continue Test
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <button
            className="btn btn-primary btn-lg px-5 py-3"
            onClick={() => navigate("/HealthForm")}
          >
            Start New Test
          </button>
        </div>
      </>
    ) : (
      <div className="col-12 text-center py-5">
        <h4 className="mb-4">
          Welcome! It looks like this is your first time here.
        </h4>
        <p className="text-muted mb-4">
          Click below to begin your first health assessment.
        </p>
        <button
          className="btn btn-primary btn-lg px-5 py-3"
          onClick={() => navigate("/HealthForm")}
        >
          Start Your First Test
        </button>
      </div>
    )}
  </div>
</div>


);
};

export default HomeClient ;
