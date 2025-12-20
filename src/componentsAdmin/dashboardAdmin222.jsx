import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doApiGet } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { addIdOutComeAdmin } from "../featuers/myDetailsSlice";

function DashboardAdmin222() {
  let nav = useNavigate();
  const initialUsers = [
    {
      date_created: "10/10/2025111",
      finishedT1: false,
      finished: false,
      _id: "69419b7817f974354d45bcaa"
    },
    {
      date_created: "11/10/2025111",
      finishedT1: true,
      finished: false,
      _id: "645f2b5e8f1b2c001f6e4c3d"
    },
  ];

  let [ar, setAr] = useState(initialUsers);
  const ThisID = useSelector((state) => state.myDetailsSlice.idMorInfoAdmin);
  const [thisUser, setThisUser] = useState([]);
  const dispatch = useDispatch();



  useEffect(() => {
    doApiUsers();
    doApiQuestions();
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
      console.log(data.data);
      setAr(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toOutCome = (id) => {
    dispatch(addIdOutComeAdmin({ idOutComeAdmin: id }));
    nav("/admin/outcomeadmin");
  };


  return (
    <div className="container">
      <div style={{ textAlign: "center", justifyContent: "center" }}>
        <h1>user details</h1>
        <h4>Name :{thisUser.fullName}</h4>
      </div>

      <div>
        <table className="table table-striped shadow-lg">
          <thead>
            <tr>
              <th>*</th>
              <th>date</th>
              <th>First assessment</th>
              <th>Second assessment</th>
              <th> Outcome</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.date_created ? user.date_created.substring(10, length - 1) : ""}</td>
                  <td>{user.finishedT1 ? "finished" : "not finished"}</td>
                  <td>{user.finished ? "finished" : "not finished"}</td>
                  <td>
                    <button
                      className="btn  btn-lg"
                      onClick={() => toOutCome(user._id)}
                    >
                      ⟶
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardAdmin222;
