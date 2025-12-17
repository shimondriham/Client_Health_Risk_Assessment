import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import surveyData from "../assets/questions.json";
import { useNavigate } from "react-router-dom";
import { addIdQuestions } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";

// --- Icons ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const CheckIcon = () => <svg width="14" height="14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function HealthForm() {
    // שליפת המזהה מה-Redux (אם הגענו דרך כפתור Continue)
    const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    
    // ניהול מזהה המבחן ב-State
    const [id_Questions, setId_Questions] = useState(thisidQuestions);

    const nav = useNavigate();
    const dispatch = useDispatch();
    const didRunRef = useRef(false);
    const isAdvancingRef = useRef(false);

    // --- טעינת נתונים (Resume Test) ---
    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;
        // אם יש מזהה (לא 0), נטען את המיקום האחרון
        if (id_Questions && id_Questions !== "0") { 
            doApiContinue(); 
        }
    }, []);

    const doApiContinue = async () => {
        let _dataBody = { idQuestions: id_Questions }
        try {
            let resp = await doApiMethod("/questions/thisQuestion", "PUT", _dataBody);
            if (resp.data._id) {
                // שחזור המיקום לפי הסקשן האחרון שנשמר
                if (resp.data.section === "Safety First") { setSectionIndex(1); }
                else if (resp.data.section === "Your Active Life") { setSectionIndex(2); }
                else if (resp.data.section === "How You Feel Day to Day") { setSectionIndex(3); }
                
                // וידוא שהמזהה מסונכרן
                setId_Questions(resp.data._id);
            }
        } catch (error) { 
            console.log("Error loading previous test:", error);
        }
    }

    const section = surveyData.sections[sectionIndex];
    const question = section.questions[questionIndex];

    const fireConfetti = () => { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); };

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
        if (q.restriction && q.restriction !== (answerState.userGender || undefined)) return false;
        const secIndexOfQ = surveyData.sections.findIndex(sec => sec.questions.some(qq => qq.id === q.id));
        const questionsInSection = secIndexOfQ !== -1 ? surveyData.sections[secIndexOfQ].questions : [];
        const qIndexInSection = questionsInSection.findIndex(qq => qq.id === q.id);
        for (let i = 0; i < qIndexInSection; i++) {
            const prevQ = questionsInSection[i];
            if (prevQ.followUps.includes(q.id)) {
                const prevAnswer = answerState[prevQ.id];
                if (!prevAnswer) return false;
                if (prevQ.whenShowFollowUps.length > 0 && !prevQ.whenShowFollowUps.map(String).includes(String(prevAnswer))) return false;
            }
        }
        return true;
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
            const answersForSection = currentSection.questions
                .filter(q => answers[q.id] !== undefined)
                .map(q => ({ id: q.id, answer: answers[q.id] }));

            // --- לוגיקה מתוקנת: שמירה ועדכון ---
            
            // תנאי: אם זה הסקשן הראשון וגם אין לנו עדיין מזהה -> ניצור חדש (POST)
            if (currentSection.section === "Safety First" && (!id_Questions || id_Questions === "0")) {
                try {
                    let resp = await doApiMethod("/questions", "POST", { section: currentSection.section, answers: answersForSection });
                    if (resp.data._id) {
                        setId_Questions(resp.data._id);
                        dispatch(addIdQuestions({ idQuestions: resp.data._id })); // עדכון Redux כדי שיישמר להמשך
                    }
                } catch (e) { console.log(e); }
            } 
            // אחרת (כל סקשן אחר, או אם כבר יש מזהה כי חזרנו למבחן) -> נעשה עדכון (PUT)
            else {
                try {
                    await doApiMethod("/questions/edit", "PUT", { 
                        idQuestions: id_Questions, // שימוש במזהה הקיים
                        section: currentSection.section, 
                        answers: answersForSection 
                    });
                } catch (e) { console.log(e); }
            }

            // חישוב השאלה הבאה
            let nextQ = questionIndex + 1;
            while (nextQ < currentSection.questions.length) {
                if (shouldShowQuestion(currentSection.questions[nextQ])) break;
                nextQ++;
            }
            if (nextQ < currentSection.questions.length) {
                setQuestionIndex(nextQ);
                return;
            }

            // מעבר לסקשן הבא
            if (sectionIndex < surveyData.sections.length - 1) {
                setSectionIndex(prev => prev + 1);
                setQuestionIndex(0);
                fireConfetti();
            } else {
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

    const handleExit = () => {
        if (window.confirm("Are you sure you want to exit? Your progress in this section is saved locally.")) {
            // אם יש מזהה, נוודא שהוא נשמר ב-Redux לפני היציאה
            if (id_Questions && id_Questions !== "0") {
                dispatch(addIdQuestions({ idQuestions: id_Questions }));
            }
            nav("/homeClient");
        }
    };

    // --- STYLES ---
    const styles = {
        page: {
            height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0,
            backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden"
        },
        wave: {
            position: "absolute", bottom: "-20%", right: "-10%", width: "120%", height: "70%",
            background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)",
            borderRadius: "100% 0 0 0 / 80% 0 0 0", zIndex: 0
        },
        card: {
            zIndex: 2, backgroundColor: "white", borderRadius: "24px",
            width: "90%", maxWidth: "850px", height: "90vh",
            boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.1)",
            display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
        },
        headerContainer: {
            padding: "30px 40px 20px 40px", backgroundColor: "white",
            borderBottom: "1px solid #f3f4f6", flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center"
        },
        stepperWrapper: {
            display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "40px", marginBottom: "25px"
        },
        stepItem: {
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", width: "100px"
        },
        stepCircle: (active) => ({
            width: "40px", height: "40px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "16px", transition: "all 0.3s ease",
            background: active ? "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)" : "white",
            color: active ? "white" : "#9ca3af",
            boxShadow: active ? "0 4px 12px rgba(123, 104, 238, 0.4)" : "none",
            border: active ? "none" : "2px solid #e5e7eb"
        }),
        stepLabel: (active) => ({
            fontSize: "13px", fontWeight: active ? "700" : "500",
            color: active ? "#4b5563" : "#9ca3af",
            lineHeight: "1.2"
        }),
        progressBarBg: {
            height: "6px", width: "100%", maxWidth: "500px", backgroundColor: "#f1f3f5", borderRadius: "10px", overflow: "hidden"
        },
        progressBarFill: (percent) => ({
            height: "100%", width: `${percent}%`, backgroundColor: "#7b68ee", transition: "width 0.4s ease", borderRadius: "10px"
        }),
        progressText: {
            fontSize: "12px", color: "#9ca3af", marginTop: "8px", fontWeight: "500"
        },
        contentScroll: {
            padding: "30px 40px", overflowY: "auto", flexGrow: 1,
            display: "flex", flexDirection: "column", alignItems: "center"
        },
        questionBox: {
            width: "100%", maxWidth: "650px"
        },
        questionText: {
            fontSize: "1.3rem", fontWeight: "700", color: "#374151", marginBottom: "1.5rem", lineHeight: "1.4"
        },
        optionRow: (selected) => ({
            display: "flex", alignItems: "center", padding: "12px 16px", marginBottom: "10px",
            borderRadius: "12px", border: selected ? "2px solid #7b68ee" : "1px solid #e5e7eb",
            backgroundColor: selected ? "#f5f3ff" : "white",
            cursor: "pointer", transition: "all 0.2s ease",
            boxShadow: selected ? "0 4px 12px rgba(123, 104, 238, 0.15)" : "0 2px 5px rgba(0,0,0,0.03)"
        }),
        footer: {
            padding: "25px 40px", backgroundColor: "white", borderTop: "1px solid #f3f4f6",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
        },
        gradientBtn: (disabled) => ({
            background: disabled ? "#e5e7eb" : "linear-gradient(90deg, #7b68ee 0%, #ec4899 100%)",
            color: disabled ? "#9ca3af" : "white", border: "none", padding: "12px 24px", minWidth: "140px", justifyContent: "center",
            borderRadius: "50px", fontWeight: "700", fontSize: "1rem", cursor: disabled ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: disabled ? "none" : "0 4px 15px rgba(123, 104, 238, 0.3)",
            transition: "all 0.3s ease"
        }),
        outlineBtn: {
            background: "white", border: "2px solid #e5e7eb", color: "#6b7280",
            padding: "10px 24px", minWidth: "140px", justifyContent: "center",
            borderRadius: "50px", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
        },
        exitBtn: {
            position: "absolute", top: "25px", right: "25px", zIndex: 10,
            background: "white", width: "44px", height: "44px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ef4444", border: "2px solid #fee2e2", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.2s"
        }
    };

    const renderInput = () => {
        switch (question.type) {
            case "radio":
                return question.options.map((opt, i) => (
                    <div key={i} onClick={() => handleAnswer(opt)} style={styles.optionRow(answers[question.id] === opt)}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: answers[question.id] === opt ? '5px solid #7b68ee' : '2px solid #d1d5db', marginRight: '14px' }}></div>
                        <span style={{ fontWeight: answers[question.id] === opt ? '700' : '500', color: '#374151', fontSize: '1rem' }}>{opt}</span>
                    </div>
                ));
            case "checkbox":
                return question.options.map((opt, i) => {
                    const isChecked = answers[question.id]?.includes(opt) || false;
                    return (
                        <div key={i} onClick={() => {
                            const prev = answers[question.id] || [];
                            handleAnswer(isChecked ? prev.filter(x => x !== opt) : [...prev, opt]);
                        }} style={styles.optionRow(isChecked)}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: isChecked ? '#7b68ee' : 'white', border: isChecked ? 'none' : '2px solid #d1d5db', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isChecked && <CheckIcon />}
                            </div>
                            <span style={{ fontWeight: isChecked ? '700' : '500', color: '#374151', fontSize: '1rem' }}>{opt}</span>
                        </div>
                    );
                });
            case "slider":
                return (
                    <div className="py-5 px-3 bg-light rounded-4 text-center">
                        <div className="mb-4">
                            <span className="display-4 fw-bold" style={{ color: '#7b68ee' }}>{answers[question.id] || 0}</span>
                            <div className="text-muted small fw-bold ls-1">SCORE (0-20)</div>
                        </div>
                        <input type="range" className="form-range w-75 mx-auto" min={0} max={20} value={answers[question.id] || 0}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            style={{ height: '8px', accentColor: '#7b68ee', cursor: 'pointer' }} />
                    </div>
                );
            case "date": return <input type="date" className="form-control form-control-lg border-0 bg-light rounded-4 p-3" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "dropdown": return (
                <select className="form-select form-select-lg border-0 bg-light rounded-4 p-3" value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)}>
                    <option value="" disabled>Select an option...</option>
                    {question.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
            );
            case "textarea": return <textarea className="form-control border-0 bg-light rounded-4 p-3" rows={5} placeholder="Type your answer..." value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "file": return <input type="file" className="form-control form-control-lg" onChange={(e) => handleAnswer(e.target.files[0]?.name)} />;
            default: return null;
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.wave}></div>

            <button style={styles.exitBtn} onClick={handleExit} title="Exit">
                <XIcon />
            </button>

            <div style={styles.card}>
                <div style={styles.headerContainer}>
                    <div style={styles.stepperWrapper}>
                        {surveyData.sections.map((s, i) => {
                            const isActive = i === sectionIndex;
                            return (
                                <div key={i} style={styles.stepItem}>
                                    <div style={styles.stepCircle(isActive)}>
                                        {i + 1}
                                    </div>
                                    <div style={styles.stepLabel(isActive)}>{s.section}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={styles.progressBarBg}>
                        <div style={styles.progressBarFill(((questionIndex + 1) / section.questions.length) * 100)}></div>
                    </div>
                    <div style={styles.progressText}>
                        Question {questionIndex + 1} of {section.questions.length}
                    </div>
                </div>

                <div style={styles.contentScroll}>
                    <div style={styles.questionBox}>
                        <h2 style={styles.questionText}>{question.question}</h2>
                        <div className="animate__animated animate__fadeInUp">
                            {renderInput()}
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button
                        onClick={back}
                        style={{ ...styles.outlineBtn, opacity: (sectionIndex === 0 && questionIndex === 0) ? 0 : 1, pointerEvents: (sectionIndex === 0 && questionIndex === 0) ? 'none' : 'auto' }}
                    >
                        <ChevronLeft /> Back
                    </button>
                    <button onClick={next} style={styles.gradientBtn(isAnswerEmpty())} disabled={isAnswerEmpty()}>
                        {sectionIndex === surveyData.sections.length - 1 && questionIndex === section.questions.length - 1 ? 'Finish Assessment' : 'Next'} <ChevronRight />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default HealthForm;