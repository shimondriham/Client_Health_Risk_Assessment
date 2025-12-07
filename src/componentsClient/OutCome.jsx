import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myQuestions from "../assets/questions.json";
import { useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";

const initialUsers = [
  {
    "question": '1',
    "answer": 'answer1',
  },
  {
    "question": '2',
    "answer": 'answer2',
  },
  {
    "question": '3',
    "answer": 'answer3',
  } 
];

function OutCome() {
  const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
  let [ar, setAr] = useState(initialUsers);
  const nav = useNavigate();
  const HomeP = () => nav("/HomeClient");

  useEffect(() => {
    doApi()
  }, [])

  const doApi = async () => {
    let idBody = {
      "idQuestions": thisidQuestions
    }
    let tempAr = [];
    try {
      let resData = await doApiMethod("/questions/thisQuestion", "PUT", idBody);
      console.log(resData);

      let data = resData.data;
      console.log(data);
      const allQuestions = myQuestions.sections.flatMap(section => section.questions);
      const questionMap = new Map(allQuestions.map(q => [q.id, q.question]));
      const questionTypeMap = new Map(allQuestions.map(q => [q.id, q.type]));
      for (let qId = 1; qId <= 53; qId++) {
        const answer = data[qId];
        if (answer !== undefined && answer !== null && !(Array.isArray(answer) && answer.length === 0)) {
          const questionText = questionMap.get(qId);
          const questionType = questionTypeMap.get(qId);
          if (questionText !== undefined) {
            let finalAnswer = questionType === "date" && typeof answer === "string" ? answer.substring(0, 10) : answer;
            if (Array.isArray(finalAnswer) && finalAnswer.length > 1) {
              finalAnswer = finalAnswer.join(", ");
            }
            tempAr.push({ question: questionText, answer: finalAnswer });
          }
        }
      }
      setAr(tempAr);
  } catch (error) {
    console.log(error);
  }
}

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
    "Thank you for completing the assessment. Here’s a summary of your answers:",
    20,
    55,
    { maxWidth: pageWidth - 40 }
  );

  autoTable(pdf, {
    startY: 75,
    head: [["Question", "Answer"]],
    body: ar.map(q => [q.question, q.answer || ""]),
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
          <h2>
            <strong>User!</strong> Thank you for completing the assessment
          </h2>
          <p>Here’s a summary of your current strengths and opportunities for growth.</p>
        </div>

        <div className="text-center mb-4">
          <p>Name / Client: <strong>User</strong></p>
          <p>Date: 04/11/2025</p>
        </div>

        {/* ⭐️ טבלה שמציגה את השאלות מה-JSON */}
        <div className="table-responsive mb-4">
          <table className="table table-striped table-bordered rounded">
            <thead className="table-secondary">
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Answer</th>
              </tr>
            </thead>

            <tbody>
              {ar.map((q, index) => (
                <tr key={index}>
                  <td>{q.question}</td>
                  <td>{q.answer || ""}</td>
                </tr>
              ))}
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
