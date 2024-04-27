import React, { useEffect, useRef, useState } from "react";
import './style.css'
const paragraph = `HELLP (Hemolysis, Elevated Liver enzymes and Low Platelets) syndrome is a life-threatening pregnancy complication usually considered to be a variant of preeclampsia. Both conditions usually occur during the later stages of pregnancy, or soon after childbirth. HELLP syndrome was named by Dr.`;

export default function TypingTest() {
  const maxTime =60;
  const [timeLeft,setTimeLeft] = useState(maxTime);
  const [mistakes,setMistakes] = useState(0);
  const [charIndex,setCharIndex] = useState(0);
  const [isTyping,setIsTyping] = useState(false);
  const [WPM,setWPM] = useState(0);
  const [CPM,setCPM] = useState(0);
  const inputRef = useRef(null);
  const charRefs = useRef([]);
  const [correctWrong,setCorrectWrong] = useState([])
  useEffect(()=>{
    inputRef.current.focus()
    setCorrectWrong(Array(charRefs.current.length).fill(''))
  },[]);
  useEffect(()=>{
    let interval;
    if (isTyping && timeLeft >0){
      interval=setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTime = maxTime - timeLeft;
        let cpm = correctChars * (60/totalTime);
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm,10));
       let wpm = Math.round((correctChars/5/totalTime)*60 );
       wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
       setWPM(wpm);
      }, 1000);
    } else if (timeLeft === 0){
      clearInterval(interval);
      setIsTyping(false);
    }
    return () =>{
      clearInterval(interval);  
    }
  },[isTyping,timeLeft])
  const  handleChange =(e)=>{
    const characters = charRefs.current;
    const currentChar=charRefs.current[charIndex];
    let typedChar = e.target.value.slice(-1)
    if(charIndex < characters.length && timeLeft > 0){
      if(!isTyping)
      setIsTyping(true)
    
    if(typedChar === currentChar.textContent){
      setCharIndex(charIndex);
      correctWrong[charIndex]="correct"
    }else{
      setCharIndex(charIndex+1);
      setMistakes(mistakes+1);
      correctWrong[charIndex]='wrong'
    }
    if(charIndex === characters.length - 1) setIsTyping(false)
  }else{
        setIsTyping(false)
}
  
  }

  return (
    <div className="container">
      <div className="test">
        <input type="text" className="input-field" ref={inputRef} onChange={handleChange}></input>
        {
          paragraph.split("").map((char,index)=>
         <span className={`char ${index === charIndex}? "active": ""`} ref={(e) => charRefs.current[index]=e}>
          {char}
         </span>
        )
        }
      </div>
      <div className="result" >
        <p>Time Left : <strong>{timeLeft}</strong></p>
        <p>Mistakes : <strong>{mistakes}</strong></p>
        <p>WPM : <strong>{WPM}</strong></p>
        <p>CPM : <strong>{CPM}</strong></p>
        <button className="btn">Try Again</button>30min
      </div>
    </div>
  );
}
