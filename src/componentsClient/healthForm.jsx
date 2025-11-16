import React, { useState } from "react";
import confetti from "canvas-confetti";

const survey = [
  { title: "Safety Check", questions: ["Q1","Q2","Q3","Q4","Q5","Q6"] },
  { title: "Your Active Life", questions: ["Q1","Q2","Q3","Q4","Q5","Q6","Q7"] },
  { title: "How You Feel Day To Day", questions: ["Q1","Q2","Q3","Q4","Q5","Q6"] },
  { title: "Your Goals", questions: ["Q1","Q2"] },
];

function HealthForm() {
  const [section, setSection] = useState(0);
  const [question, setQuestion] = useState(0);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState("");

  
  const fireConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const next = () => {
    if (question < survey[section].questions.length - 1) {
      setQuestion(question + 1);
    } else if (section < survey.length - 1) {
      setSection(section + 1);
      setQuestion(0);
      fireConfetti(); // 🎉 
    }
  };

  const back = () => {
    if (question > 0) {
      setQuestion(question - 1);
    } else if (section > 0) {
      const prevCount = survey[section - 1].questions.length;
      setSection(section - 1);
      setQuestion(prevCount - 1);
    }
  };

  return (
    <div style={{direction:"ltr",width:"100%",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"Arial",background:"#f9fafb"}}>
      
      
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"45px",padding:"30px 0"}}>
        {survey.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            
            
            {i !== 0 && (<div style={{width: 40,height: 3,background: i <= section ? "#6d28d9" : "#d1d5db", marginRight: 20,transition:"0.3s" }}/>
            )}

            
            <div style={{textAlign:"center",opacity:i===section?1:0.4}}>
              <div style={{ width:32,height:32,borderRadius:"50%", border:"2px solid #6d28d9",background:i===section?"#6d28d9":"white",color:i===section?"white":"#6d28d9",display:"flex", alignItems:"center",justifyContent:"center",fontWeight:"bold", margin:"0 auto" }}>
               {i+1}
              </div>
              <div style={{fontSize:13,marginTop:5}}>{s.title}</div>
            </div>
          </div>
        ))}
      </div>

     
      <div style={{width:260,height:6,borderRadius:6,background:"#e5e7eb",marginTop:30,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${((question+1)/survey[section].questions.length)*100}%`,background:"#6d28d9",transition:"0.3s"}} />
      </div>
      
      <h2 style={{marginTop:30}}>{survey[section].title}</h2>
      <h3 style={{marginTop:10}}>Question {question+1}/{survey[section].questions.length}</h3>

      <div style={{width:300,height:190,borderRadius:20,background:"white",boxShadow:"0 0 12px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",marginTop:20,fontSize:20}}>
        {survey[section].questions[question]}
      </div>

      <div style={{display:"flex",gap:20,marginTop:45}}>
        <button onClick={back} style={{padding:"8px 24px",background:"white",border:"1px solid #d1d5db",borderRadius:8,cursor:"pointer"}}>Back</button>
        {/* <button onClick={Pause} style={{padding:"8px 24px",background:"white",border:"1px solid #d1d5db",borderRadius:8,cursor:"pointer"}}>Pause</button> */}
        <button onClick={next} style={{padding:"8px 24px",background:"#7c3aed",color:"white",border:"none",borderRadius:8,cursor:"pointer"}}>Next</button>
      </div>
    </div>
  );
}

export default HealthForm;
