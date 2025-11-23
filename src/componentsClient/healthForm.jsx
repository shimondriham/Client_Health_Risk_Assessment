import React, { useState } from "react";
import confetti from "canvas-confetti";
import surveyData from "../assets/questions.json";
import { useNavigate } from "react-router-dom";
import { addIdQuestions } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";

function HealthForm() {
  const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userGender, setUserGender] = useState("female");
  const [id_Questions, setId_Questions] = useState(thisidQuestions);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const section = surveyData.sections[sectionIndex];
  const question = section.questions[questionIndex];
  const fireConfetti = () => {
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
  };

  const cleanInvalidAnswers = (newAnswers) => {
    const validAnswers = {};
    surveyData.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (shouldShowQuestion(q, newAnswers)) {
          if (newAnswers[q.id] !== undefined) validAnswers[q.id] = newAnswers[q.id];
        }
      });
    });
    return validAnswers;
  };

  const handleAnswer = (value) => {
    const newAnswers = cleanInvalidAnswers({ ...answers, [question.id]: value });
    setAnswers(newAnswers);
  };

  const shouldShowQuestion = (q, answerState = answers) => {
    if (q.restriction && q.restriction !== userGender) return false;

    for (let prevQ of section.questions) {
      if (prevQ.followUps.includes(q.id)) {
        const prevAnswer = answerState[prevQ.id];
        if (!prevAnswer) return false;
        if (prevQ.whenShowFollowUps.length > 0 && !prevQ.whenShowFollowUps.includes(prevAnswer)) {
          return false;
        }
      }
    }
    return true;
  };

  const isAnswerEmpty = () => {
    const ans = answers[question.id];
    return ans === undefined || ans === "" || (Array.isArray(ans) && ans.length === 0);
  };

  const next = async () => {
    if (isAnswerEmpty()) return;

    let nextQ = questionIndex + 1;
    while (nextQ < section.questions.length) {
      if (shouldShowQuestion(section.questions[nextQ])) break;
      nextQ++;
    }

    if (nextQ < section.questions.length) {
      setQuestionIndex(nextQ);
    } else {
      let sectionObj = {}
      if (section.section === "Safety First") {
        sectionObj = {
          section: section.section,
          answers: section.questions
            .filter(q => answers[q.id] !== undefined)
            .map(q => ({ id: q.id, answer: answers[q.id] }))
        };
        try {
          let resp = await doApiMethod("/questions", "POST", sectionObj);
          if (resp.data._id) {
            setId_Questions(resp.data._id);
            dispatch(addIdQuestions({ idQuestions: resp.data._id }));
            console.log("Section answers updated successfully");
          }
        }
        catch (error) {
          console.log(error);
        }
      } else {
        sectionObj = {
          idQuestions: id_Questions,
          section: section.section,
          answers: section.questions
            .filter(q => answers[q.id] !== undefined)
            .map(q => ({ id: q.id, answer: answers[q.id] }))
        };
        try {
          let resp = await doApiMethod("/questions/edit", "PUT", sectionObj);
          if (resp.data.modifiedCount == 1) {
            console.log("Section answers updated successfully");
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      console.log("Section completed:", sectionObj);
      if (sectionIndex < surveyData.sections.length - 1) {
        setSectionIndex(sectionIndex + 1);
        setQuestionIndex(0);
        fireConfetti();
      } else {
        alert("Survey complete! Check console for answers.");
        nav("/CalibrationVideo");
      }
    }
  };


  const back = () => {
    let prevQ = questionIndex - 1;
    while (prevQ >= 0) {
      if (shouldShowQuestion(section.questions[prevQ])) break;
      prevQ--;
    }

    if (prevQ >= 0) {
      setQuestionIndex(prevQ);
    } else if (sectionIndex > 0) {
      const prevSection = surveyData.sections[sectionIndex - 1];
      let lastQ = prevSection.questions.length - 1;
      while (lastQ >= 0) {
        if (shouldShowQuestion(prevSection.questions[lastQ])) break;
        lastQ--;
      }
      setSectionIndex(sectionIndex - 1);
      setQuestionIndex(lastQ >= 0 ? lastQ : 0);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case "radio":
        return question.options.map((opt, i) => (
          <label key={i} style={{ display: "block", margin: "5px 0" }}>
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={answers[question.id] === opt}
              onChange={(e) => handleAnswer(e.target.value)}
            />{" "}
            {opt}
          </label>
        ));
      case "checkbox":
        return question.options.map((opt, i) => (
          <label key={i} style={{ display: "block", margin: "5px 0" }}>
            <input
              type="checkbox"
              value={opt}
              checked={answers[question.id]?.includes(opt) || false}
              onChange={(e) => {
                const prev = answers[question.id] || [];
                const newValue = e.target.checked ? [...prev, opt] : prev.filter(x => x !== opt);
                handleAnswer(newValue);
              }}
            />{" "}
            {opt}
          </label>
        ));
      case "slider":
        return (
          <div style={{ width: "100%", position: "relative", marginTop: "10px" }}>
            <input
              type="range"
              min={0}
              max={20}
              value={answers[question.id] || 0}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                top: "-25px",
                left: `${((answers[question.id] || 0) / 20) * 100}%`,
                transform: "translateX(-50%)",
                background: "#6d28d9",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {answers[question.id] || 0}
            </div>
          </div>
        );
      case "date":
        return <input type="date" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
      case "dropdown":
        return (
          <select value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)}>
            <option value="" disabled>Select an option</option>
            {question.options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "textarea":
        return <textarea value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} rows={4} style={{ width: "100%" }} />;
      case "file":
        return <input type="file" onChange={(e) => handleAnswer(e.target.files[0]?.name)} />;
      default:
        return null;
    }
  };

  if (!shouldShowQuestion(question)) {
    next();
    return null;
  }

  return (
    <div style={{ direction: "ltr", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Arial", background: "#f9fafb", paddingBottom: 50 }}>
      {/* Sections Progress */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "45px", padding: "30px 0" }}>
        {surveyData.sections.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {i !== 0 && (<div style={{ width: 40, height: 3, background: i <= sectionIndex ? "#6d28d9" : "#d1d5db", marginRight: 20, transition: "0.3s" }} />)}
            <div style={{ textAlign: "center", opacity: i === sectionIndex ? 1 : 0.4 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #6d28d9", background: i === sectionIndex ? "#6d28d9" : "white", color: i === sectionIndex ? "white" : "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", margin: "0 auto" }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 13, marginTop: 5 }}>{s.section}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Question Progress */}
      <div style={{ width: 260, height: 6, borderRadius: 6, background: "#e5e7eb", marginTop: 30, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((questionIndex + 1) / section.questions.length) * 100}%`, background: "#6d28d9", transition: "0.3s" }} />
      </div>

      <h2 style={{ marginTop: 30 }}>{section.section}</h2>
      <h3 style={{ marginTop: 10 }}>Question {questionIndex + 1}/{section.questions.length}</h3>

      {/* Question Box */}
      <div style={{ width: 300, minHeight: 150, borderRadius: 20, background: "white", boxShadow: "0 0 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", marginTop: 20, padding: 20, fontSize: 16 }}>
        <div style={{ marginBottom: 10, fontWeight: "bold" }}>{question.question}</div>
        {renderQuestionInput()}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 20, marginTop: 45 }}>
        <button onClick={back} style={{ padding: "8px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }}>Back</button>
        <button
          onClick={next}
          style={{
            padding: "8px 24px",
            background: isAnswerEmpty() ? "#d1d5db" : "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: isAnswerEmpty() ? "not-allowed" : "pointer"
          }}
          disabled={isAnswerEmpty()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HealthForm;
