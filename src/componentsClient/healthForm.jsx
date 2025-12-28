import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import surveyData from "../assets/questions.json";
import { useNavigate } from "react-router-dom";
import { addIdQuestions } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";
import reactIcon from '../assets/react.svg'; 

// --- אייקונים ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Spinner = () => <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path></svg>;

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
                if (resp.data.section === "Safety First") { setSectionIndex(1); }
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
            if (isAnswerEmpty()) return;

            const ansValue = getCurrentAnswer();
            setAnswers(prev => ({...prev, [question.id]: ansValue}));

            const currentSection = surveyData.sections[sectionIndex];
            const allAnswers = { ...answers, [question.id]: ansValue };
            
            const answersForSection = currentSection.questions
                .filter(q => allAnswers[q.id] !== undefined && allAnswers[q.id] !== "")
                .map(q => ({ id: q.id, answer: allAnswers[q.id] }));
            
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

            let nextQ = questionIndex + 1;
            if (nextQ < currentSection.questions.length) {
                setQuestionIndex(nextQ);
            } else {
                if (sectionIndex < surveyData.sections.length - 1) {
                    setSectionIndex(prev => prev + 1);
                    setQuestionIndex(0);
                    fireConfetti();
                } else {
                    nav("/h_statement");
                }
            }
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const back = () => {
        if (questionIndex > 0) {
            setQuestionIndex(questionIndex - 1);
        } else if (sectionIndex > 0) {
            setSectionIndex(sectionIndex - 1);
            setQuestionIndex(surveyData.sections[sectionIndex - 1].questions.length - 1);
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
        
        switch (question.type) {
            case "radio":
                return question.options.map((opt, i) => (
                    <div key={i} onClick={() => handleAnswer(opt)} style={styles.optionCard(val === opt)}>
                        <div style={styles.radioCircle(val === opt)}></div>
                        <span>{opt}</span>
                    </div>
                ));
            case "checkbox":
                return question.options.map((opt, i) => {
                    const isChecked = val?.includes(opt) || false;
                    return (
                        <div key={i} onClick={() => {
                            const prev = val || [];
                            handleAnswer(isChecked ? prev.filter(x => x !== opt) : [...prev, opt]);
                        }} style={styles.optionCard(isChecked)}>
                            <div style={{
                                width:'22px', height:'22px', borderRadius:'6px', border: isChecked ? 'none' : '2px solid #E5E7EB',
                                backgroundColor: isChecked ? ORANGE : 'white', 
                                display:'flex', alignItems:'center', justifyContent:'center', 
                                marginRight:'16px', flexShrink: 0
                            }}>
                                {isChecked && <CheckIcon />}
                            </div>
                            <span>{opt}</span>
                        </div>
                    );
                });
            case "slider":
                return (
                    <div className="py-5 px-3">
                        <div className="text-center mb-4">
                            <span className="display-3 fw-bold font-outfit" style={{color: ORANGE}}>{val}</span>
                        </div>
                        <input type="range" className="form-range w-100" min={0} max={20} value={val}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            style={{accentColor: ORANGE, cursor: 'pointer', height: '8px'}} 
                        />
                        <div className="d-flex justify-content-between text-muted small fw-bold mt-2">
                            <span>0</span><span>20</span>
                        </div>
                    </div>
                );
            case "date": return <input type="date" className="form-control border bg-light p-3 rounded-3" value={val || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "dropdown": return (
                <select className="form-select border bg-light p-3 rounded-3" value={val || ""} onChange={(e) => handleAnswer(e.target.value)}>
                    <option value="" disabled>Select...</option>
                    {question.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
            );
            case "textarea": return <textarea className="form-control border bg-light p-3 rounded-3" rows={4} value={val || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "file": return <input type="file" className="form-control" onChange={(e) => handleAnswer(e.target.files[0]?.name)} />;
            default: return null;
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
            <nav className="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0">
                    <div className="d-flex align-items-center gap-2">
                        <img src={reactIcon} alt="Logo" width="22" className="opacity-75" />
                        <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
                    </div>
                {/* יציאה ימין */}
                <button 
                    onClick={handleExit} 
                    style={styles.exitButton}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    <XIcon /> Exit
                </button>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3 overflow-hidden">
                <div className="w-100 h-100 d-flex flex-column" style={{ maxWidth: '750px' }}>
                    
                    {/* Stepper & Header - נשאר קבוע */}
                    <div className="flex-shrink-0 mb-3 mt-2">
                        <div className="d-flex justify-content-center gap-3 mb-2">
                            {surveyData.sections.map((s, i) => {
                                const isActive = i === sectionIndex;
                                const isCompleted = i < sectionIndex;
                                return (
                                    <div key={i} className="d-flex flex-column align-items-center" style={{width: '120px'}}>
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
                        
                        <div className="w-100 bg-light rounded-pill mt-3" style={{height: '4px', overflow:'hidden'}}>
                            <div className="h-100" style={{
                                width: `${((questionIndex + 1) / section.questions.length) * 100}%`, 
                                backgroundColor: ORANGE, 
                                borderRadius: '10px',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <div className="text-center text-muted mt-2" style={{fontSize:'0.75rem', fontWeight:'500', letterSpacing:'0.5px'}}>
                            QUESTION {questionIndex + 1} / {section.questions.length}
                        </div>
                    </div>

                    {/* Question Title - קבוע */}
                    <div className="flex-shrink-0 text-center px-2 mb-3">
                        <h2 className="fw-bold text-dark" style={{fontSize: '1.8rem', lineHeight: '1.3'}}>
                            {question.question}
                        </h2>
                    </div>

                    {/* Answer Area - כאן הלוגיקה החדשה לגלילה! */}
                    <div 
                        className={`px-2 ${isLongList ? 'flex-grow-1 custom-scrollbar' : 'mb-2'}`}
                        style={{ overflowY: isLongList ? 'auto' : 'visible', minHeight: isLongList ? '0' : 'auto' }}
                    >
                        {renderInput()}
                        {/* רווח קטן רק אם יש גלילה */}
                        {isLongList && <div style={{height: '10px'}}></div>}
                    </div>

                    {/* Spacer - דוחף את הפוטר למטה אם הרשימה קצרה */}
                    {!isLongList && <div className="flex-grow-1"></div>}

                    {/* Footer Actions - תמיד למטה */}
                    <div className="flex-shrink-0 mt-3 pt-3 border-top border-light d-flex align-items-center justify-content-between">
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
                                if(!isAnswerEmpty()) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 100, 36, 0.5)";
                                }
                            }}
                            onMouseOut={(e) => {
                                if(!isAnswerEmpty()) {
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