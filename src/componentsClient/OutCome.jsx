import React from "react";

function OutCome() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        paddingTop: "60px",
      }}
    >
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>
          <strong>User!</strong> Thank you for completing the assessment,
        </h2>
        <p>
          Here’s a summary of your current strengths and opportunities for
          growth.
        </p>
      </div>

      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <p>name / Client : User</p>
        <p>Date: 04/11/2025</p>
      </div>

      
      <div
        style={{
          backgroundColor: "#d9d9d9",
          border: "1px solid gray",
          borderRadius: "15px",
          width: "70%",
          padding: "20px",
          boxSizing: "border-box",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#bcbcbc" }}>
              <th
                style={{
                  borderBottom: "2px solid gray",
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                Domain
              </th>
              <th
                style={{
                  borderBottom: "2px solid gray",
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                Score
              </th>
              <th
                style={{
                  borderBottom: "2px solid gray",
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                Communication
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                85
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                Strong verbal and written skills
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                Teamwork
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                78
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid gray" }}>
                Good collaboration with peers
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>Problem Solving</td>
              <td style={{ padding: "10px" }}>92</td>
              <td style={{ padding: "10px" }}>Excellent analytical thinking</td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <button
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#d3d3d3",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => alert("Download clicked")}
      >
        Download
      </button>
    </div>
  );
}

export default OutCome;
