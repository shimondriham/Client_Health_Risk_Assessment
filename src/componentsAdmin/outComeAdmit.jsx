import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doApiGet } from "../services/apiService";

function OutComeAdmin() {
  const ThisID = useSelector((state) => state.myDetailsSlice.idOutComeAdmin);
  let [allDetails, setAllDetails] = useState();
  let nav = useNavigate();

  useEffect(() => {
    console.log(ThisID);
    // doApi();
  }, []);

  // const doApiAllDetails = async () => {

  //   let url = "/" + ThisID;
  //   try {
  //     let data = await doApiGet(url);
  //     console.log(data.data);
  //     setAllDetails(data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const HomeP = () => {
    nav("/HomeClient");
  };



  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 shadow-lg p-4 bg-white rounded">


          <div className="text-center mb-4">
            <h2><strong>User!</strong> Thank you for completing the assessment</h2>
            <p>Summary of the subject's current strengths and opportunities for growth</p>
          </div>


          <div className="text-center mb-4">
            <p>Name / Client: <strong>User</strong></p>
            <p>Date: 04/11/2025</p>
          </div>


          <div className="table-responsive mb-4">
            <table className="table table-striped table-bordered rounded">
              <thead className="table-secondary">
                <tr>
                  <th scope="col">Domain</th>
                  <th scope="col">Score</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Communication</td>
                  <td>85</td>
                  <td>Strong verbal and written skills</td>
                </tr>
                <tr>
                  <td>Teamwork</td>
                  <td>78</td>
                  <td>Good collaboration with peers</td>
                </tr>
                <tr>
                  <td>Problem Solving</td>
                  <td>92</td>
                  <td>Excellent analytical thinking</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="d-flex justify-content-between m-2">
            <button
              className="btn btn-primary btn-lg" onClick={HomeP}
            >
              ⟵ Back to Home
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => alert("Download clicked")}
            >
              Download
            </button>

            {/* <button
          className="btn btn-primary btn-lg" onClick={HomeP}
          >
          ⟵ Back to Home
         </button> */}
          </div>

        </div>
      </div>
    </div>
  );
}

export default OutComeAdmin;
