import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName } from '../featuers/myDetailsSlice';
import "bootstrap/dist/css/bootstrap.min.css";

const HomeClient = () => {
  const myName = useSelector(state => state.myDetailsSlice.name);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [myInfo, setmyInfo] = useState({});
  const dispatch = useDispatch();

  // Example test data placeholder, replace later with API if needed
  const tests = [
    { id: 1, date: "22 Jan 2025", status: "Completed" },
    { id: 2, date: "20 Jan 2025", status: "Incomplete" },
    { id: 3, date: "24 Jan 2025", status: "Incomplete" },
    { id: 4, date: "26 Jan 2025", status: "Completed" },
    { id: 5, date: "18 Jan 2025", status: "Incomplete" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      Completed: "success",
      Incomplete: "danger",
    };
    return <span className={`badge bg-${colors[status]}`}>{status}</span>;
  };

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    doApi();
  }, []);

  const doApi = async () => {
    let url = "/users/myInfo";
    try {
      let data = await doApiGet(url);
      setmyInfo(data.data);
      dispatch(addName({ name: data.data.fullName }));
      if (data.data.role === "admin") {
        dispatch(addIsAdmin({ isAdmin: true }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-5">

      {/* TITLE */}
      <h2 className="text-center mb-5">
        Welcome Back {myName || "User"}!
      </h2>

      <div className="row">

        {/* LEFT SIDE TABLE */}
        <div className="col-md-7">
          <table className="table table-hover shadow-sm rounded overflow-hidden">
            <thead className="table-light">
              <tr>
                <th></th>
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
                      <button className="btn btn-outline-success btn-sm">
                        Download Report
                      </button>
                    )}

                    {(test.status === "Incomplete" ) && (
                      <button className="btn btn-outline-primary btn-sm">
                        Continue Test
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE BUTTON */}
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <button className="btn btn-primary btn-lg px-5 py-3"
          onClick={() => navigate("/ExplanatoryV")}>
            
            Start New Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;
