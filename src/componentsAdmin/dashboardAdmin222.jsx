import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doApiGet } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { addIdOutComeAdmin } from "../featuers/myDetailsSlice";

function DashboardAdmin222() {
  let nav = useNavigate();
  const initialUsers = [
    {
      id: 1,
      date_created: "10/10/2025111",
      a: "a",
      b: "a",
      _id: "645f2b5e8888888888888888"
    },
    {
      id: 2,
      date_created: "10/11/2025111",
      a: "b",
      b: "b",
      _id: "645f2b5e8f1b2c001f6e4c3d"
    },
  ];

  let [ar, setAr] = useState(initialUsers);
  const ThisID = useSelector((state) => state.myDetailsSlice.idMorInfoAdmin);
  const [thisUser, setThisUser] = useState([]); 
   const dispatch = useDispatch();
  


  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    let url = "/users/single/" + ThisID;
    try {
      let data = await doApiGet(url);
      // console.log(data.data);
      setThisUser(data.data);
      // doApiAllDetails();
    } catch (error) {
      console.log(error);
    }
  };

  // const doApiAllDetails = async () => {

  //   let url = "/" + ThisID;
  //   try {
  //     let data = await doApiGet(url);
  //     console.log(data.data);
  //     setAr(data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
              <th>?</th>
              <th>?</th>
              <th>?</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.date_created ? user.date_created.substring(10, length - 1) : ""}</td>
                  <td>{user.a}</td>
                  <td>{user.b}</td>
                  <td>
                    <button
            className="btn  btn-lg"
            onClick={() => alert("Download clicked")}
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
