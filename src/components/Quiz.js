import React, { useEffect, useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const decodeEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"
        );
        const formattedQuestions = response.data.results.map((question) => ({
          ...question,
          question: decodeEntities(question.question),
          incorrect_answers: question.incorrect_answers.map(decodeEntities),
          correct_answer: decodeEntities(question.correct_answer),
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleClick = (answer) => {
    if (answer === questions[currentQuestions].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestions < questions.length - 1) {
      setCurrentQuestions(currentQuestions + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center bg-gradient-to-r from-green-200 to-green-500">
      <div className="min-h-screen flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4 ">Quiz App</h1>
        {questions.length > 0 ? (
          showScore ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your score: {score} / {questions.length}
              </h2>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 mx-52 rounded-md p-5">
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestions + 1} / {questions.length}
              </h2>
              <p className="text-lg mb-4 font-semibold">
                {questions[currentQuestions].question}
              </p>

              <div className="grid grid-cols-2 gap-4 mx-44">
                {questions[currentQuestions].incorrect_answers.map(
                  (option, index) => (
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                      key={index}
                      onClick={() => handleClick(option)}
                    >
                      {option}
                    </button>
                  )
                )}

                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() =>
                    handleClick(questions[currentQuestions].correct_answer)
                  }
                >
                  {questions[currentQuestions].correct_answer}
                </button>
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
