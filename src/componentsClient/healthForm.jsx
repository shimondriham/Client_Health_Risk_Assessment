import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import surveyData from "../assets/questions.json";
import { useNavigate } from "react-router-dom";
import { addIdQuestions } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";
import thisIcon from '../assets/icon.png';

// --- אייקונים ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Spinner = () => <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path></svg>;
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

const styles = {
    exitButton: {
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "50px",
        padding: "8px 20px",
        color: "#6B7280",
        fontWeight: "600",
        fontSize: "0.9rem",
        display: "flex", alignItems: "center", gap: '8px',
        cursor: "pointer",
        transition: "all 0.2s ease"
    }
};

function HealthForm() {
    const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [id_Questions, setId_Questions] = useState(thisidQuestions);
    const [isLoading, setIsLoading] = useState(false);

    const nav = useNavigate();
    const dispatch = useDispatch();
    const didRunRef = useRef(false);

    const ORANGE = "#F96424";

    // --- לוגיקה ---
    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;
        if (id_Questions && id_Questions !== "0") { doApiContinue(); }
    }, []);

    const doApiContinue = async () => {
        let _dataBody = { idQuestions: id_Questions }
        try {
            let resp = await doApiMethod("/questions/thisQuestion", "PUT", _dataBody);
            if (resp.data._id) {
                if (resp.data.section === "Safety First") {
                    setSectionIndex(1);
                    // setSectionIndex(33);
                }
                else if (resp.data.section === "Your Active Life") { setSectionIndex(2); }
                else if (resp.data.section === "How You Feel Day to Day") { setSectionIndex(3); }
                setId_Questions(resp.data._id);
            }
        } catch (error) { console.log(error); }
    }

    const section = surveyData.sections[sectionIndex];
    const question = section.questions[questionIndex];

    const fireConfetti = () => { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); };

    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));
    };

    const getCurrentAnswer = () => {
        let ans = answers[question.id];
        if (question.type === 'slider' && ans === undefined) return 0;
        return ans;
    };

    const isAnswerEmpty = () => {
        const ans = getCurrentAnswer();
        if (question.type === 'file') return false;
        if (question.type === 'slider') return false;
        return ans === undefined || ans === "" || (Array.isArray(ans) && ans.length === 0);
    };

    const next = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            if (isAnswerEmpty()) {
                setIsLoading(false);
                return;
            }

            const ansValue = getCurrentAnswer();
            const updatedAnswers = { ...answers, [question.id]: ansValue };
            setAnswers(updatedAnswers);

            const currentSection = surveyData.sections[sectionIndex];
            const answersForSection = currentSection.questions
                .filter(q => updatedAnswers[q.id] !== undefined && updatedAnswers[q.id] !== "")
                .map(q => ({ id: q.id, answer: updatedAnswers[q.id] }));

            if (answersForSection.length > 0 && (
                answersForSection[answersForSection.length - 1].id == 53
                || answersForSection[answersForSection.length - 1].id == 51
                || answersForSection[answersForSection.length - 1].id == 39
                || answersForSection[answersForSection.length - 1].id == 32
                || (answersForSection[answersForSection.length - 1].id == 30 && answersForSection[answersForSection.length - 1].answer != "Yes")
                || (answersForSection[answersForSection.length - 1].id == 29 && answersForSection[answersForSection.length - 1].answer != "Female")
            )) {
                if (currentSection.section === "Safety First" && (!id_Questions || id_Questions === "0")) {
                    try {
                        let resp = await doApiMethod("/questions", "POST", { section: currentSection.section, answers: answersForSection });
                        if (resp.data._id) {
                            setId_Questions(resp.data._id);
                            dispatch(addIdQuestions({ idQuestions: resp.data._id }));
                        }
                    } catch (e) { console.log(e); }
                } else {
                    try {
                        await doApiMethod("/questions/edit", "PUT", {
                            idQuestions: id_Questions,
                            section: currentSection.section,
                            answers: answersForSection
                        });
                    } catch (e) { console.log(e); }
                }
            }

            let skipCount = 0;

            if (question.followUps && question.followUps.length > 0) {
                const shouldShow = question.whenShowFollowUps.includes(ansValue);
                if (!shouldShow) {
                    skipCount = question.followUps.length;
                    console.log(`Skipping ${skipCount} questions because answer was "${ansValue}"`);
                }
            }

            let nextQIndex = questionIndex + 1 + skipCount;
            if (nextQIndex < currentSection.questions.length) {
                setQuestionIndex(nextQIndex);
            } else {
                if (sectionIndex < surveyData.sections.length - 1) {
                    setSectionIndex(prev => prev + 1);
                    setQuestionIndex(0);
                    fireConfetti();
                } else {
                    nav("/h_statement");
                }
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const back = () => {
        const findParentQuestion = (currentQId, sectionQuestions) => {
            return sectionQuestions.find(q => q.followUps && q.followUps.includes(currentQId));
        };

        if (questionIndex > 0) {
            const currentSection = surveyData.sections[sectionIndex];
            let newIndex = questionIndex - 1;

            while (newIndex >= 0) {
                const targetQ = currentSection.questions[newIndex];
                const parentQ = findParentQuestion(targetQ.id, currentSection.questions);

                if (parentQ) {
                    const parentAnswer = answers[parentQ.id];
                    if (!parentQ.whenShowFollowUps.includes(parentAnswer)) {
                        newIndex = currentSection.questions.findIndex(q => q.id === parentQ.id);
                        continue;
                    }
                }
                break;
            }

            setQuestionIndex(newIndex);

        } else if (sectionIndex > 0) {
            const prevSectionIndex = sectionIndex - 1;
            const prevSection = surveyData.sections[prevSectionIndex];
            let newIndex = prevSection.questions.length - 1;

            while (newIndex >= 0) {
                const targetQ = prevSection.questions[newIndex];
                const parentQ = findParentQuestion(targetQ.id, prevSection.questions);

                if (parentQ) {
                    const parentAnswer = answers[parentQ.id];
                    if (!parentQ.whenShowFollowUps.includes(parentAnswer)) {
                        newIndex = prevSection.questions.findIndex(q => q.id === parentQ.id);
                        continue;
                    }
                }
                break;
            }

            setSectionIndex(prevSectionIndex);
            setQuestionIndex(newIndex);
        }
    };

    const handleExit = () => {
        if (window.confirm("Exit assessment? Progress is saved.")) {
            nav("/homeClient");
        }
    };


    const isLongList = question.options && question.options.length > 4;

    // --- CSS פנימי ---
    const styles = {
        optionCard: (selected) => ({
            display: "flex", alignItems: "center", padding: "16px 20px", marginBottom: "12px",
            borderRadius: "16px",
            border: selected ? `2px solid ${ORANGE}` : "2px solid #F3F4F6",
            backgroundColor: selected ? "#FFFBF9" : "#fff",
            cursor: "pointer", fontSize: "1rem", color: "#1a1a1a", fontWeight: selected ? "500" : "400",
            transition: "all 0.2s ease",
            boxShadow: selected ? "0 4px 12px rgba(249, 100, 36, 0.15)" : "none"
        }),
        radioCircle: (selected) => ({
            width: '22px', height: '22px', borderRadius: '50%',
            border: selected ? `6px solid ${ORANGE}` : '2px solid #E5E7EB',
            marginRight: '16px', flexShrink: 0, backgroundColor: "white",
            transition: "all 0.2s ease"
        }),
        stepperCircle: (active, completed) => ({
            width: "36px", height: "36px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "600", fontSize: "14px",
            backgroundColor: (active || completed) ? ORANGE : "#F3F4F6",
            color: (active || completed) ? "white" : "#9CA3AF",
            marginBottom: "8px",
            transition: "all 0.3s ease",
            boxShadow: active ? `0 4px 10px ${ORANGE}60` : "none",
            flexShrink: 0
        }),
        orangeButton: (disabled) => ({
            backgroundColor: disabled ? "#E5E7EB" : ORANGE,
            color: disabled ? "#9CA3AF" : "white",
            border: "none",
            borderRadius: "50px",
            padding: "14px 40px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: disabled ? "none" : "0 4px 14px rgba(249, 100, 36, 0.4)",
            display: "flex", alignItems: "center", gap: "10px",
            transition: "all 0.3s ease"
        }),
        exitButton: {
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "50px",
            padding: "8px 20px",
            color: "#6B7280",
            fontWeight: "600",
            fontSize: "0.9rem",
            display: "flex", alignItems: "center", gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
        }
    };

    const renderInput = () => {
        const val = getCurrentAnswer();

        // רוחבים שונים לפי סוג שאלה
        const widths = {
            radio: "400px",
            checkbox: "400px",
            slider: "500px",
            date: "300px",
            dropdown: "350px",
            textarea: "450px",
            file: "400px"
        };

        const inputWidth = {
            width: widths[question.type] || "400px",
            maxWidth: "100%"
        };

        switch (question.type) {
            case "radio":
                return question.options.map((opt, i) => (
                    <div
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        style={{
                            ...styles.optionCard(val === opt),
                            ...inputWidth,
                            margin: "8px auto",      // מרכז אופקית
                            display: "flex",          // יישור פנימי של ה-radio + text
                            alignItems: "center"
                        }}
                    >
                        <div style={styles.radioCircle(val === opt)}></div>
                        <span>{opt}</span>
                    </div>
                ));

            case "checkbox":
                return question.options.map((opt, i) => {
                    const isChecked = val?.includes(opt) || false;
                    return (
                        <div
                            key={i}
                            onClick={() => {
                                const prev = val || [];
                                handleAnswer(isChecked ? prev.filter(x => x !== opt) : [...prev, opt]);
                            }}
                            style={{
                                ...styles.optionCard(isChecked),
                                ...inputWidth,
                                margin: "8px auto",      // מרכז אופקית
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <div style={{
                                width: '22px', height: '22px', borderRadius: '6px',
                                border: isChecked ? 'none' : '2px solid #E5E7EB',
                                backgroundColor: isChecked ? ORANGE : 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginRight: '16px', flexShrink: 0
                            }}>
                                {isChecked && <CheckIcon />}
                            </div>
                            <span>{opt}</span>
                        </div>
                    );
                });

            case "slider":
                return (
                    <div className="py-5 px-3 d-flex flex-column align-items-center" style={{ ...inputWidth, margin: "0 auto" }}>
                        <div className="text-center mb-4">
                            <span className="display-3 fw-bold font-outfit" style={{ color: ORANGE }}>{val}</span>
                        </div>
                        <input
                            type="range"
                            min={0} max={5} value={val}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            className="form-range"
                            style={{ ...inputWidth, accentColor: ORANGE, cursor: 'pointer', height: '8px' }}
                        />
                        <div className="d-flex justify-content-between text-muted small fw-bold mt-2" style={inputWidth}>
                            <span>0</span><span>5</span>
                        </div>
                    </div>
                );
            case "sleepslider":
                return (
                    <div className="py-5 px-3 d-flex flex-column align-items-center" style={{ ...inputWidth, margin: "0 auto" }}>
                        <div className="text-center mb-4">
                            <span className="display-3 fw-bold font-outfit" style={{ color: ORANGE }}>{val}</span>
                        </div>
                        <input
                            type="range"
                            min={0} max={12} value={val}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            className="form-range"
                            style={{ ...inputWidth, accentColor: ORANGE, cursor: 'pointer', height: '8px' }}
                        />
                        <div className="d-flex justify-content-between text-muted small fw-bold mt-2" style={inputWidth}>
                            <span>0</span><span>12</span>
                        </div>
                    </div>
                );

            case "date":
                return (
                    <div className="d-flex justify-content-center">
                        <input
                            type="date"
                            className="form-control border bg-light p-3 rounded-3"
                            style={{ ...inputWidth, margin: "0 auto" }}
                            value={val || ""}
                            onChange={(e) => handleAnswer(e.target.value)}
                        />
                    </div>
                );

            case "dropdown":
                return (
                    <div className="d-flex justify-content-center">
                        <select
                            className="form-select border bg-light p-3 rounded-3"
                            value={val || ""}
                            onChange={(e) => handleAnswer(e.target.value)}
                            style={{ ...inputWidth, margin: "0 auto" }}
                        >
                            <option value="" disabled>Select...</option>
                            {question.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                );

            case "textarea":
                return (
                    <div className="d-flex justify-content-center">
                        <textarea
                            className="form-control border bg-light p-3 rounded-3"
                            rows={4}
                            value={val || ""}
                            onChange={(e) => handleAnswer(e.target.value)}
                            style={{ ...inputWidth, margin: "0 auto" }}
                        />
                    </div>
                );

            case "file":
                return (
                    <div className="d-flex justify-content-center">
                        <input
                            type="file"
                            className="form-control"
                            style={{ ...inputWidth, margin: "0 auto" }}
                            onChange={(e) => handleAnswer(e.target.files[0]?.name)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e0e0e0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #bdbdbd; }
            `}</style>

            {/* Navbar */}
            <nav className="d-flex align-items-center justify-content-between px-4 py-1 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                    <img src={thisIcon} alt="Logo" width="35" className="opacity-75" />
                    <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
                </div>
                {/* יציאה ימין */}
                <button
                    onClick={() => nav("/HomeClient")}
                    style={styles.exitButton}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <HomeIcon /> Home
                </button>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-1 overflow-hidden">
                <div className="w-100 h-100 d-flex flex-column" style={{ maxWidth: '750px' }}>

                    {/* Stepper & Header - נשאר קבוע */}
                    <div className="flex-shrink-0 mb-3 mt-2">
                        <div className="d-flex justify-content-center gap-3 mb-2 ">
                            {surveyData.sections.map((s, i) => {
                                const isActive = i === sectionIndex;
                                const isCompleted = i < sectionIndex;
                                return (
                                    <div key={i} className="d-flex flex-column align-items-center" style={{ width: '120px' }}>
                                        <div style={styles.stepperCircle(isActive, isCompleted)}>
                                            {isCompleted ? <CheckIcon /> : i + 1}
                                        </div>
                                        <div className="text-center w-100" style={{
                                            fontSize: '0.75rem',
                                            fontWeight: isActive ? '700' : '500',
                                            color: isActive ? '#1a1a1a' : '#9ca3af',
                                            lineHeight: '1.2',
                                            whiteSpace: 'normal'
                                        }}>
                                            {s.section}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-100 bg-light rounded-pill mt-3" style={{ height: '4px', overflow: 'hidden' }}>
                            <div className="h-100" style={{
                                width: `${((questionIndex + 1) / section.questions.length) * 100}%`,
                                backgroundColor: ORANGE,
                                borderRadius: '10px',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <div className="text-center text-muted mt-2" style={{ fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                            QUESTION {questionIndex + 1} / {section.questions.length}
                        </div>
                    </div>

                    {/* Question Title - קבוע */}
                    <div className="flex-shrink-0 text-center px-2 mb-3">
                        <h2 className="fw-bold text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.3' }}>
                            {question.question}
                        </h2>
                    </div>


                    <div
                        className={`px-2 ${isLongList ? 'flex-grow-1 custom-scrollbar' : 'mb-2'}`}
                        style={{ overflowY: isLongList ? 'auto' : 'visible', minHeight: isLongList ? '0' : 'auto' }}
                    >
                        {renderInput()}
                        {/* רווח קטן רק אם יש גלילה */}
                        {isLongList && <div style={{ height: '10px' }}></div>}
                    </div>

                    {/* Spacer - דוחף את הפוטר למטה אם הרשימה קצרה */}
                    {!isLongList && <div className="flex-grow-1"></div>}

                    {/* Footer Actions - תמיד למטה */}
                    <div className="flex-shrink-0 mt-1 pt-1 border-top border-light d-flex align-items-center justify-content-between">
                        <button
                            onClick={back}
                            className="btn btn-link text-decoration-none text-secondary"
                            style={{
                                visibility: (sectionIndex === 0 && questionIndex === 0) ? 'hidden' : 'visible',
                                fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px'
                            }}
                        >
                            <ChevronLeft /> Back
                        </button>

                        <button
                            onClick={next}
                            disabled={isAnswerEmpty() || isLoading}
                            style={styles.orangeButton(isAnswerEmpty() || isLoading)}
                            onMouseOver={(e) => {
                                if (!isAnswerEmpty()) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 100, 36, 0.5)";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isAnswerEmpty()) {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(249, 100, 36, 0.4)";
                                }
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                                    <Spinner /> Processing...
                                </>
                            ) : (
                                <>
                                    {sectionIndex === surveyData.sections.length - 1 && questionIndex === section.questions.length - 1 ? 'Finish' : (question.type === 'file' ? 'Skip / Next' : 'Next')}
                                    <ChevronRight />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HealthForm;