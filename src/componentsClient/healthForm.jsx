import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import surveyData from "../assets/questions.json";
import { useNavigate } from "react-router-dom";
import { addIdQuestions } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";
import logo from '../assets/react.svg'; 

// --- Icons ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const CheckIcon = () => <svg width="14" height="14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function HealthForm() {
    const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [id_Questions, setId_Questions] = useState(thisidQuestions);

    const nav = useNavigate();
    const dispatch = useDispatch();
    const didRunRef = useRef(false);
    const isAdvancingRef = useRef(false);
    
    const ORANGE = "#F96424"; 

    // --- Logic (אותו לוגיקה בדיוק) ---
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
            while (nextQ < currentSection.questions.length) {
                if (shouldShowQuestion(currentSection.questions[nextQ])) break;
                nextQ++;
            }
            if (nextQ < currentSection.questions.length) {
                setQuestionIndex(nextQ);
                return;
            }

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
        if (window.confirm("Exit assessment? Progress is saved locally.")) {
            if (id_Questions && id_Questions !== "0") dispatch(addIdQuestions({ idQuestions: id_Questions }));
            nav("/homeClient");
        }
    };

    // --- Styles ---
    const styles = {
        optionRow: (selected) => ({
            display: "flex", alignItems: "center", padding: "16px 24px", marginBottom: "12px", 
            borderRadius: "14px", 
            border: selected ? `1px solid ${ORANGE}` : "1px solid transparent",
            backgroundColor: "#F8F9FA", // רקע אפור בהיר לאפשרויות
            cursor: "pointer", fontSize: "1rem", color: "#333", fontWeight: selected ? "500" : "400",
            transition: "all 0.2s ease"
        }),
        radioCircle: (selected) => ({
            width: '22px', height: '22px', borderRadius: '50%', 
            border: selected ? `6px solid ${ORANGE}` : '2px solid #D1D5DB', 
            marginRight: '16px', flexShrink: 0, backgroundColor: "white"
        }),
        checkboxSquare: (selected) => ({
             width: '22px', height: '22px', borderRadius: '6px', 
             backgroundColor: selected ? ORANGE : 'white', 
             border: selected ? 'none' : '2px solid #D1D5DB', 
             marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }),
        stepCircle: (active, completed) => ({
            width: "36px", height: "36px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "600", fontSize: "14px", 
            backgroundColor: (active || completed) ? ORANGE : "#F3F4F6",
            color: (active || completed) ? "white" : "#9CA3AF",
            marginBottom: "6px"
        }),
        gradientBtn: (disabled) => ({
            backgroundColor: disabled ? "#E5E7EB" : ORANGE,
            color: disabled ? "#9CA3AF" : "white", 
            border: "none", padding: "12px 40px", fontSize: "1rem", borderRadius: "50px", 
            fontWeight: "500", cursor: disabled ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: disabled ? "none" : "0 4px 15px rgba(249, 100, 36, 0.2)"
        })
    };

    const renderInput = () => {
        switch (question.type) {
            case "radio":
                return question.options.map((opt, i) => (
                    <div key={i} onClick={() => handleAnswer(opt)} style={styles.optionRow(answers[question.id] === opt)}>
                        <div style={styles.radioCircle(answers[question.id] === opt)}></div>
                        <span className="font-inter">{opt}</span>
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
                            <div style={styles.checkboxSquare(isChecked)}>{isChecked && <CheckIcon />}</div>
                            <span className="font-inter">{opt}</span>
                        </div>
                    );
                });
            case "slider":
                return (
                    <div className="py-5 px-4 rounded-4 text-center" style={{backgroundColor: '#F9FAFB'}}>
                        <div className="mb-3 d-flex align-items-baseline justify-content-center gap-2">
                            <span className="display-4 fw-light font-outfit" style={{ color: ORANGE }}>{answers[question.id] || 0}</span>
                            <span className="text-muted fw-normal font-inter" style={{fontSize: '0.85rem'}}>SCORE (0-20)</span>
                        </div>
                        <input type="range" className="form-range w-100 mx-auto" min={0} max={20} value={answers[question.id] || 0}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            style={{ height: '6px', accentColor: ORANGE, cursor: 'pointer' }} />
                    </div>
                );
            case "date": return <input type="date" className="form-control border-0 p-3 font-inter" style={{backgroundColor: '#F8F9FA', fontSize:'1rem', borderRadius:'12px'}} value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "dropdown": return (
                <select className="form-select border-0 p-3 font-inter" style={{backgroundColor: '#F8F9FA', fontSize:'1rem', borderRadius:'12px'}} value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)}>
                    <option value="" disabled>Select an option...</option>
                    {question.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
            );
            case "textarea": return <textarea className="form-control border-0 p-3 font-inter" style={{backgroundColor: '#F8F9FA', fontSize:'1rem', borderRadius:'12px'}} rows={5} placeholder="Type your answer here..." value={answers[question.id] || ""} onChange={(e) => handleAnswer(e.target.value)} />;
            case "file": return <input type="file" className="form-control form-control-lg font-inter" onChange={(e) => handleAnswer(e.target.files[0]?.name)} />;
            default: return null;
        }
    };

    return (
        <>
        {/* הטמעת הפונטים */}
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
            .font-outfit { font-family: 'Outfit', sans-serif; }
            .font-inter { font-family: 'Inter', sans-serif; }
            `}
        </style>

        <div className="vh-100 bg-white d-flex flex-column font-inter text-dark overflow-hidden">
            
            {/* Navbar */}
            <nav className="d-flex align-items-center px-4 py-3" style={{ height: '70px', flexShrink: 0 }}>
                <img src={logo} alt="Logo" width="24" className="opacity-75" />
                <span className="ms-2 font-outfit fw-bold" style={{fontSize: '1.1rem', color: '#333'}}>Fitwave.ai</span>
                
                <button 
                    onClick={handleExit} 
                    className="ms-auto btn btn-light border-0 text-muted d-flex align-items-center gap-2 px-3 rounded-pill font-outfit" 
                    style={{fontSize: '0.85rem', fontWeight: '500'}}
                >
                    <XIcon /> Exit
                </button>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex justify-content-center align-items-center p-3" style={{ overflow: 'hidden' }}>
                <div className="w-100 d-flex flex-column h-100" style={{ maxWidth: '750px' }}>
                    
                    {/* Stepper */}
                    <div className="d-flex justify-content-center gap-4 mb-3">
                        {surveyData.sections.map((s, i) => {
                            const isActive = i === sectionIndex;
                            const isCompleted = i < sectionIndex;
                            return (
                                <div key={i} className="d-flex flex-column align-items-center" style={{width: '90px'}}>
                                    <div style={styles.stepCircle(isActive, isCompleted)}>
                                        {isCompleted ? <CheckIcon /> : i + 1}
                                    </div>
                                    <div className="text-truncate w-100 text-center text-muted font-outfit" style={{fontSize: '0.7rem', marginTop:'4px', fontWeight: '500'}}>
                                        {s.section}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-100 bg-light rounded-pill mb-2" style={{height: '6px'}}>
                        <div className="h-100 rounded-pill" style={{width: `${((questionIndex + 1) / section.questions.length) * 100}%`, backgroundColor: ORANGE, transition: 'width 0.3s ease'}}></div>
                    </div>
                    <div className="text-center text-muted mb-4 font-inter" style={{fontSize: '0.8rem'}}>Question {questionIndex + 1} of {section.questions.length}</div>

                    {/* Question Area */}
                    <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', minHeight: '0', paddingRight: '5px' }}>
                        <h2 className="text-center mb-4 font-outfit" style={{ fontSize: '1.8rem', fontWeight: '600', lineHeight: '1.3', color: '#111' }}>
                            {question.question}
                        </h2>
                        
                        <div className="px-1 pb-2">
                            {renderInput()}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mt-auto">
                        <button
                            onClick={back}
                            className="btn btn-lg text-secondary border-0 px-3 font-outfit"
                            style={{ 
                                opacity: (sectionIndex === 0 && questionIndex === 0) ? 0 : 1, 
                                pointerEvents: (sectionIndex === 0 && questionIndex === 0) ? 'none' : 'auto', 
                                fontSize: '1rem', fontWeight: '500',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <ChevronLeft /> Back
                        </button>

                        <button 
                            onClick={next} 
                            disabled={isAnswerEmpty()}
                            className="font-outfit"
                            style={styles.gradientBtn(isAnswerEmpty())}
                        >
                            {sectionIndex === surveyData.sections.length - 1 && questionIndex === section.questions.length - 1 ? 'Finish Assessment' : 'Next Question'} 
                            <ChevronRight />
                        </button>
                    </div>

                </div>
            </div>
        </div>
        </>
    );
}

export default HealthForm;