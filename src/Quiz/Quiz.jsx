import React, { useMemo, useState } from 'react';
import { quizData } from "./quiz.js";
import "./Quiz.css";

const questionPerSection = 50;

const Quiz = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [sectionScores, setSectionScores] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleOptionChange = (index, value) => {
    if (isSubmitted) return;
    setSelectedOptions((prevOptions) => ({ ...prevOptions, [index]: value }));
  };

  const sections = useMemo(() => {
    if (!quizData.quiz || !Array.isArray(quizData.quiz)) {
      return [];
    }
    const sections = [];
    for (let i = 0; i < quizData.quiz.length; i += questionPerSection) {
      sections.push(quizData.quiz.slice(i, i + questionPerSection));
    }
    return sections;
  }, [quizData]);

  const currentSectionQuestions = sections[currentSection];

  const handleNextSection = () => {
    if (currentSection === sections.length - 1) {
      setQuizCompleted(true); // Mark quiz as completed on last section
      calculateTotalScore(); // Calculate total score before showing the table
    } else {
      setShowAnswers(false);
      setSelectedOptions({});
      setIsSubmitted(false);
      setCurrentSection((prevSection) => Math.min(prevSection + 1, sections.length - 1));
    }
  };

  const handlePrevSection = () => {
    setShowAnswers(false);
    setSelectedOptions({});
    setIsSubmitted(false);
    setCurrentSection((prevSection) => Math.max(prevSection - 1, 0));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    currentSectionQuestions.forEach((question, index) => {
      if (selectedOptions[index] === question.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowAnswers(true);
    setIsSubmitted(true);
    setSectionScores((prevScores) => ({
      ...prevScores,
      [currentSection]: correctCount,
    }));
  };

  const calculateTotalScore = () => {
    const totalScore = Object.values(sectionScores).reduce((a, b) => a + b, 0);
    const totalMarks = sections.length * questionPerSection;
    setTotalScore(totalScore);
    setTotalMarks(totalMarks);
  };

  return (
    <div id="main">
      {!quizCompleted ? ( // Conditionally render quiz or table
        <>
          <div className="score-container">
            {showAnswers && (
              <div className="score-circle">
                <span className="score-text" style={{ color: "red" }}>
                  {score}/{currentSectionQuestions.length}
                </span>
              </div>
            )}
          </div>
          <h1>Quiz</h1>
          <h2>Quiz-Section {currentSection + 1}/{sections.length}</h2>
          {currentSectionQuestions.map((question, index) => (
            <div key={index} className="quiz">
              <h3 style={{ textDecoration: "underline" }}>Question: {index + 1}</h3>
              <h3>{question.question}</h3>
              <ul>
              <li><input type="radio" name={`options-section-${currentSection}-${index}`} checked={selectedOptions[index] === "A"} onChange={() => handleOptionChange(index, "A")} disabled = {isSubmitted}/> A. {question.A}</li>
              <li><input type="radio" name={`options-section-${currentSection}-${index}`} checked={selectedOptions[index] === "B"} onChange={() => handleOptionChange(index, "B")} disabled = {isSubmitted}/> B. {question.B}</li>
              <li><input type="radio" name={`options-section-${currentSection}-${index}`} checked={selectedOptions[index] === "C"} onChange={() => handleOptionChange(index, "C")} disabled = {isSubmitted}/> C. {question.C}</li>
              <li><input type="radio" name={`options-section-${currentSection}-${index}`} checked={selectedOptions[index] === "D"} onChange={() => handleOptionChange(index, "D")} disabled = {isSubmitted}/> D. {question.D}</li>
              </ul>
              {showAnswers && (
                <h4>
                  {selectedOptions[index] === question.answer ? (
                    <span className="correct" style={{ color: "green" }}>Correct!</span>
                  ) : (
                    <span className="incorrect" style={{ color: "red" }}>Answer: {question.answer}</span>
                  )}
                </h4>
              )}
            </div>
          ))}
          {showAnswers && (
            <h2>
              Your Score: {score}/{currentSectionQuestions.length}
            </h2>
          )}
          <div className="buttons">
            <button onClick={handlePrevSection} disabled={currentSection === 0}>Prev</button>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleNextSection} disabled={currentSection === sections.length - 1 && isSubmitted}>Next</button>
          </div>
        </>
      ) : (
        // Table rendering after quiz 
        <>
        <div className="score-container">
        {/* Display the score circle with total score on the last page */}
        <div className="score-circle">
          <span className="score-text" style={{
              color: totalScore >= 0.35 * totalMarks ? "green" : "red",
            }}>
            {/* Total score / Total possible marks */}
            {totalScore}/{totalMarks}
          </span>
        </div>
      </div>
        <div className='table'>
          <h1 style={{textDecoration:"underline"}}>Quiz Scores</h1>
        <table border="1">
          <thead>
            <tr>
              <th >Section No.</th>
              <th >Score</th>
              <th >Total Marks</th>
              <th >Remarks</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((_,index)=>{
              const score = sectionScores[index] || 0;
              let remarks = "";
              let remarksColor = "";
              if (score >= 50) {
                remarks = "Excellent";
                remarksColor = "green";
              } else if (score >= 40) {
                remarks = "Very Good";
                remarksColor = "green";
              } else if (score >= 35) {
                remarks = "Good";
                remarksColor = "green";
              } else if (score >= 20) {
                remarks = "Fair";
                remarksColor = "green"; 
              } else if (score >= 10) {
                remarks = "Needs Improvement";
                remarksColor = "red";
              } else {
                remarks = "Try Harder!";
                remarksColor = "red";
              }
              return (
                <tr key={index} >
                <td style={{fontWeight:"520",padding:"10px"}}>{index + 1}</td>
                <td style={{padding:"10px"}}>{score}</td>
                <td style={{padding:"10px"}}>{questionPerSection}</td>
                <td style={{ color: remarksColor,fontWeight:"550",padding:"10px"}}>{remarks}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
        </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
