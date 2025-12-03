import React, { useEffect, useRef, useState } from "react";
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
  const [id_Questions, setId_Questions] = useState(thisidQuestions);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitReason, setExitReason] = useState(null);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const didRunRef = useRef(false);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
     if (didRunRef.current) return;
    didRunRef.current = true;
    if (id_Questions != "0") { doApiContinue(); }
  }, []);

  const doApiContinue = async () => {
    let _dataBody = { idQuestions: id_Questions }
    try {
      let resp = await doApiMethod("/questions/thisQuestion", "PUT", _dataBody);
      if (resp.data._id) {
        if (resp.data.section === "Safety First") { setSectionIndex(1); }
        else if (resp.data.section === "Your Active Life") { setSectionIndex(2); }
        else if (resp.data.section === "How You Feel Day to Day") { setSectionIndex(3); }
        setId_Questions(resp.data._id);
      } 
      // else {
      //   setId_Questions("0");
      // }
    }
    catch (error) {
    }
  }

  
  const section = surveyData.sections[sectionIndex];
  const question = section.questions[questionIndex];
  const fireConfetti = () => { confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } }); };
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

  const onHomeClick = async () => {
    let _dataBody = { exitrisen: exitReason };
    try {
      let resp = await doApiMethod("/users/exitrisen", "PUT", _dataBody);
      if (resp.data.matchedCount == 1) {
        setShowExitModal(false);
        dispatch(addIdQuestions({ idQuestions: "0" }));
        nav("/homeClient");
      }
    } catch (error) {
      console.log(error.response?.data?.error || error);
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = cleanInvalidAnswers({ ...answers, [question.id]: value });
    setAnswers(newAnswers);
  };

  const shouldShowQuestion = (q, answerState = answers) => {
    if (q.restriction && q.restriction !== (answerState.userGender || undefined)) return false;

    const secIndexOfQ = surveyData.sections.findIndex(sec => sec.questions.some(qq => qq.id === q.id));
    const questionsInSection = secIndexOfQ !== -1 ? surveyData.sections[secIndexOfQ].questions : [];
    const qIndexInSection = questionsInSection.findIndex(qq => qq.id === q.id);
    for (let i = 0; i < qIndexInSection; i++) {
      const prevQ = questionsInSection[i];
      if (prevQ.followUps.includes(q.id)) {
        const prevAnswer = answerState[prevQ.id];
        if (!prevAnswer) {
          return false;
        }
        if (prevQ.whenShowFollowUps.length > 0 && !prevQ.whenShowFollowUps.map(String).includes(String(prevAnswer))) {
          return false;
        }
      }
    }
    const res = true;
    return res;
  };

  const isAnswerEmpty = () => {
    const ans = answers[question.id];
    return ans === undefined || ans === "" || (Array.isArray(ans) && ans.length === 0);
  };

  const next = async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    try {
      if (isAnswerEmpty()) return;

      const currentSection = surveyData.sections[sectionIndex];
      let nextQ = questionIndex + 1;
      while (nextQ < currentSection.questions.length) {
        if (shouldShowQuestion(currentSection.questions[nextQ])) break;
        nextQ++;
      }

      if (nextQ < currentSection.questions.length) {
        setQuestionIndex(nextQ);
        return;
      }

      const answersForSection = currentSection.questions
        .filter(q => answers[q.id] !== undefined)
        .map(q => ({ id: q.id, answer: answers[q.id] }));

      if (currentSection.section === "Safety First") {
        try {
          let resp = await doApiMethod("/questions", "POST", { section: currentSection.section, answers: answersForSection });
          if (resp.data._id) {
            setId_Questions(resp.data._id);
            dispatch(addIdQuestions({ idQuestions: resp.data._id }));
          }
        } catch (error) { console.log(error); }
      } else {
        try {
          let resp = await doApiMethod("/questions/edit", "PUT", { idQuestions: id_Questions, section: currentSection.section, answers: answersForSection });
          if (resp.data.modifiedCount == 1) console.log("Section answers saved");
        } catch (error) { console.log(error); }
      }

      if (sectionIndex < surveyData.sections.length - 1) {
        setSectionIndex(prev => prev + 1);
        setQuestionIndex(0);
        fireConfetti();
      } else {
        alert("Survey complete! Check console for answers.");
        nav("/h_statement");
      }
    } finally {
      isAdvancingRef.current = false;
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
          <label key={i} className="d-block mb-2">
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
          <label key={i} className="d-block mb-2">
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
          <div style={{ position: "relative" }} className="w-100 mt-2">
            <input
              type="range"
              min={0}
              max={20}
              value={answers[question.id] || 0}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              className="w-100"
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
        return <input type="date" className="form-control" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
      case "dropdown":
        return (
          <select className="form-select" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)}>
            <option value="" disabled>Select an option</option>
            {question.options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "textarea":
        return <textarea className="form-control" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} rows={4} />;
      case "file":
        return <input type="file" className="form-control" onChange={(e) => handleAnswer(e.target.files[0]?.name)} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const checkAndAdvance = async () => {
      if (!shouldShowQuestion(question) && !isAdvancingRef.current) {
        isAdvancingRef.current = true;
        try {
          await next();
        } catch (err) {
          console.error(err);
        } finally {
          isAdvancingRef.current = false;
        }
      }
    };
    checkAndAdvance();
  }, [sectionIndex, questionIndex]);

  return (
    <div className="d-flex flex-column align-items-center pb-5" style={{ direction: "ltr", fontFamily: "Arial", background: "#f9fafb" }}>
      {/* Sections Progress */}
      <div className="d-flex justify-content-center align-items-center gap-4 py-3">
        {surveyData.sections.map((s, i) => (
          <div key={i} className="d-flex align-items-center">
            {i !== 0 && (<div style={{ width: 40, height: 3, background: i <= sectionIndex ? "#6d28d9" : "#d1d5db", marginRight: 20, transition: "0.3s" }} />)}
            <div style={{ textAlign: "center", opacity: i === sectionIndex ? 1 : 0.4 }}>
              <div className="rounded-circle border d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, border: "2px solid #6d28d9", background: i === sectionIndex ? "#6d28d9" : "white", color: i === sectionIndex ? "white" : "#6d28d9", margin: "0 auto" }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 13, marginTop: 5 }}>{s.section}</div>
            </div>
          </div>
        ))}
      </div>



      {/* <h2 style={{ marginTop: 30 }}>{section.section}</h2> */}
      <h4 style={{ marginTop: 10 }}>Question {questionIndex + 1}/{section.questions.length}</h4>

      {/* Question Box */}
      <div style={{ width: 300, minHeight: 150, borderRadius: 20, background: "white", boxShadow: "0 0 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", marginTop: 20, padding: 20, fontSize: 16 }}>
        <div style={{ marginBottom: 10, fontWeight: "bold" }}>{question.question}</div>
        {renderQuestionInput()}
      </div>

      {/* Question Progress */}
      <div className="mt-4" style={{ width: 260, height: 6, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((questionIndex + 1) / section.questions.length) * 100}%`, background: "#6d28d9", transition: "0.3s" }} />
      </div>

      {/* Navigation */}
      <div className="d-flex gap-3 mt-4">
        <button onClick={back} style={{ padding: "8px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }} className="me-2">Back</button>
        <button onClick={() => setShowExitModal(true)} style={{ padding: "8px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }} className="me-2">Exit</button>
        <button onClick={next} style={{ padding: "8px 24px", background: isAnswerEmpty() ? "#d1d5db" : "#7c3aed", color: "white", border: "none", borderRadius: 8 }} disabled={isAnswerEmpty()}>
          Next
        </button>
      </div>
      {showExitModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div className="p-4" style={{
            background: "white",
            borderRadius: 12,
            width: 340
          }}>
            <h3 className="mb-3">Why are you leaving the questionnaire?</h3>

            <label className="d-block mb-2">
              <input
                type="radio"
                name="exitReason"
                value="Not feeling well physically"
                checked={exitReason === "Not feeling well physically"}
                onChange={(e) => setExitReason(e.target.value)}
              />{" "}
              Not feeling well physically
            </label>

            <label className="d-block mb-2">
              <input
                type="radio"
                name="exitReason"
                value="I don't have time right now"
                checked={exitReason === "I don't have time right now"}
                onChange={(e) => setExitReason(e.target.value)}
              />{" "}
              I don't have time right now
            </label>

            <label className="d-block mb-2">
              <input
                type="radio"
                name="exitReason"
                value="The questionnaire is too long or confusing"
                checked={exitReason === "The questionnaire is too long or confusing"}
                onChange={(e) => setExitReason(e.target.value)}
              />{" "}
              The questionnaire is too long
            </label>

            <div className="d-flex gap-2 mt-3 justify-content-end">
              <button className="me-2" onClick={() => {
                setShowExitModal(false);
                setExitReason(null);
              }}>
                Cancel
              </button>

              <button
                onClick={onHomeClick}
                disabled={!exitReason}
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HealthForm;