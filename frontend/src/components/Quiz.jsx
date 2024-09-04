import React, { useState } from 'react';
import './Quizstyle.css'

function Quiz() {
  const [answers, setAnswers] = useState({
    mood: '',
    energy: '',
    stress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({
      ...answers,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz Results:', answers);
    alert('Thank you for completing the quiz!');
  };

  return (
    <div>
      <h2>Daily Assessment Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label>
          How was your mood today?
          <select name="mood" value={answers.mood} onChange={handleChange}>
            <option value="">Select</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
          </select>
        </label>

        <label>
          How was your energy level today?
          <select name="energy" value={answers.energy} onChange={handleChange}>
            <option value="">Select</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          How stressed did you feel today?
          <select name="stress" value={answers.stress} onChange={handleChange}>
            <option value="">Select</option>
            <option value="not at all">Not at all</option>
            <option value="a little">A little</option>
            <option value="a lot">A lot</option>
          </select>
        </label>

        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default Quiz;