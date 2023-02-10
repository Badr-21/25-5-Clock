import "./App.css";
import { useEffect, useRef, useState } from "react";
function App() {
   const [breakLength, setBreakLength] = useState(5);
   const [sessionLength, setSessionLength] = useState(25);
   const [timeLeft, setTimeLeft] = useState(25 * 60);
   const [timerON, setTimerOn] = useState(false);
   const [timeType, setTimeType] = useState("SESSION");
   const timeRef = useRef();
   const audioRef = useRef();
   const timeFormat = () => {
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
      return `${formattedMinutes}:${formattedSeconds}`;
   };

   const timeout = () => {
      timeRef.current = setTimeout(() => {
         if (timeLeft && timerON) {
            setTimeLeft((prevState) => prevState - 1);
         }
      }, 1000);
   };

   const incrementBreakLength = () => {
      if (breakLength < 60 && !timerON) {
         setBreakLength((prevState) => prevState + 1);
      }
   };

   const decrementBreakLength = () => {
      if (breakLength > 1 && !timerON) {
         setBreakLength((prevState) => prevState - 1);
      }
   };

   const incrementSessionLength = () => {
      if (sessionLength < 60 && !timerON) {
         setSessionLength((prevState) => prevState + 1);
         setTimeLeft((prevState) => prevState + 60);
      }
   };

   const decrementSessionLength = () => {
      if (sessionLength > 1 && !timerON) {
         setSessionLength((prevState) => prevState - 1);
         setTimeLeft((prevState) => prevState - 60);
      }
   };

   const handlePlay = () => {
      clearTimeout(timeRef.current);
      setTimerOn(!timerON);
   };

   const handleReset = () => {
      setTimerOn(false);
      clearTimeout(timeRef.current);
      setTimeLeft(25 * 60);
      setBreakLength(5);
      setSessionLength(25);
      setTimeType("SESSION");
      audioRef.current.load();
   };

   const changeTimer = () => {
      if (!timeLeft && timeType === "SESSION") {
         setTimeLeft(breakLength * 60);
         setTimeType("BREAK");
         audioRef.current.play();
      } else if (!timeLeft && timeType === "BREAK") {
         setTimeLeft(sessionLength * 60);
         setTimeType("SESSION");
         audioRef.current.play();
      }
   };

   const clock = () => {
      if (timerON) {
         timeout();
         changeTimer();
      } else {
         clearTimeout(timeRef.current);
      }
   };

   useEffect(() => {
      clock();
   }, [timerON, timeLeft, timeRef.current]);

   const title = timeType === "SESSION" ? "Session" : "Break";

   return (
      <div className="App">
         <h1>25 + 5 Clock</h1>
         <div id="container">
            <div id="lengths">
               <div id="break">
                  <h2 id="break-label">Break Length</h2>
                  <div id="break-change">
                     <span
                        id="break-decrement"
                        className="fa-solid fa-arrow-down"
                        onClick={decrementBreakLength}
                     ></span>
                     <div id="break-length">{breakLength}</div>
                     <span
                        id="break-increment"
                        className="fa-solid fa-arrow-up"
                        onClick={incrementBreakLength}
                     ></span>
                  </div>
               </div>
               <div id="session">
                  <h2 id="session-label">session Length</h2>
                  <div id="session-change">
                     <span
                        id="session-decrement"
                        className="fa-solid fa-arrow-down"
                        onClick={decrementSessionLength}
                     ></span>
                     <div id="session-length">{sessionLength}</div>
                     <span
                        id="session-increment"
                        className="fa-solid fa-arrow-up"
                        onClick={incrementSessionLength}
                     ></span>
                  </div>
               </div>
            </div>
            <div id="timer">
               <div id="timer-label">{title}</div>
               <div id="time-left">{timeFormat()}</div>
            </div>
            <div id="start-stop-reset">
               <div id="start_stop" onClick={handlePlay}>
                  <span className="fa-solid fa-play"></span>
                  <span className="fa-solid fa-pause"></span>
               </div>
               <span id="reset" className="fa-solid fa-arrows-rotate" onClick={handleReset}></span>
            </div>
            <audio id="beep" ref={audioRef}>
               <source
                  src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                  type="audio/wav"
               />
            </audio>
         </div>
      </div>
   );
}

export default App;
