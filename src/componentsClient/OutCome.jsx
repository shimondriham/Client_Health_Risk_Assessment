import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function OutCome() {
  const nav = useNavigate();
  const HomeP = () => nav("/HomeClient");

  const handleDownload = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("User Report", pageWidth / 2, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Name / Client: User", 20, 35);
    pdf.text("Date: 04/11/2025", 20, 42);

    pdf.text(
      "Thank you for completing the assessment. Here’s a summary of your current strengths and opportunities for growth.",
      20,
      55,
      { maxWidth: pageWidth - 40 }
    );

    autoTable(pdf, {
      startY: 75,
      head: [["Domain", "Score", "Description"]],
      body: [
        ["Communication", "85", "Strong verbal and written skills"],
        ["Teamwork", "78", "Good collaboration with peers"],
        ["Problem Solving", "92", "Excellent analytical thinking"],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220] },
      styles: { font: "helvetica", fontSize: 12 },
      margin: { left: 20, right: 20 },
    });

    pdf.save("User_Report.pdf");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 shadow-lg p-4 bg-white rounded">
          <div className="text-center mb-4">
            <h2><strong>User!</strong> Thank you for completing the assessment</h2>
            <p>Here’s a summary of your current strengths and opportunities for growth.</p>
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
            <button className="btn btn-primary btn-lg" onClick={HomeP}>
              ⟵ Back to Home
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleDownload}>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutCome;
