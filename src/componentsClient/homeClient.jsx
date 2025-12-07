import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName, addIdQuestions } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";

const HomeClient = () => {
  const _tests = [
    { _id: 1, date_created: "22 Jan 2025", finished: true ,finishedT1:true},
    { _id: 2, date_created: "20 Jan 2025", finished: false ,finishedT1:false},
    { _id: 3, date_created: "20 Jan 2025", finished: false ,finishedT1:true},
  ];
  const myName = useSelector(state => state.myDetailsSlice.name);
  const idQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
  const navigate = useNavigate();
  const [myInfo, setmyInfo] = useState({});
  const [tests, setTests] = useState(_tests);
  const [hasTests, setHasTests] = useState(false);
  const [nextSection, setNextSection] = useState(null);
  const dispatch = useDispatch();



  const getStatusBadge = (finished) => {
    if (finished) {
      return <span className="badge bg-success">Completed</span>;
    }
    return <span className="badge bg-danger">Incomplete</span>;
  };

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    dispatch(addIdQuestions({ idQuestions: "0" }));
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      let data = await doApiGet("/users/myInfo");
      setmyInfo(data.data);
      console.log("data.data:", data.data);

      dispatch(addName({ name: data.data.fullName }));
      if (data.data.role === "admin") dispatch(addIsAdmin({ isAdmin: true }));


      try {
        let questionsResp = await doApiGet("/questions/myInfo");
        if (questionsResp.data) {
          console.log(questionsResp.data);
          setTests(questionsResp.data);
          if (questionsResp.data.length > 0) {
            setHasTests(true);
          }
          dispatch(addIdQuestions({ idQuestions: questionsResp.data._id }));

          const sections = ["section1", "section2", "section3", "section4"];
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



  return (<div className="container py-5"> <h2 className="text-center mb-5">
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
                {tests.map((test, index) => {
                  return (
                    <tr key={test._id}>
                      <td>{index + 1}</td>
                      <td>{test.date_created.substring(10, length - 1)}</td>
                      <td>{getStatusBadge(test.finished)}</td>
                      <td>
                        {/* {getActionsBadge(test.finished)} */}
                        {test.finished && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => {
                              dispatch(addIdQuestions({ idQuestions: test._id }));
                              navigate(`/outCome`);
                            }}
                          >
                            To Report
                          </button>
                        )}
                        {!test.finished && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              dispatch(addIdQuestions({ idQuestions: test._id }));
                              if (test.finishedT1) {
                                navigate(`/calibration`)
                              } else {
                                navigate(`/HealthForm`)
                              }
                            }}
                          >
                            Continue Test
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <button
              className="btn btn-primary btn-lg px-5 py-3"
              onClick={() => navigate("/explanatoryV")}
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
            onClick={() => navigate("/explanatoryV")}
          >
            Start Your First Test
          </button>
        </div>
      )}
    </div>
  </div>


  );
};

export default HomeClient;
