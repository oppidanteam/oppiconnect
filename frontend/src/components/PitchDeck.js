import React, { useState } from 'react';

const PitchDeck = () => {
  const [slides, setSlides] = useState([{ title: '', content: '' }]);

  const addSlide = () => {
    setSlides([...slides, { title: '', content: '' }]);
  };

  const updateSlide = (index, field, value) => {
    const newSlides = slides.slice();
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSubmit = () => {
    // Submit the pitch deck for feedback
  };

  return (
    <div>
      <h1>Pitch Deck</h1>
      {slides.map((slide, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Title"
            value={slide.title}
            onChange={(e) => updateSlide(index, 'title', e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={slide.content}
            onChange={(e) => updateSlide(index, 'content', e.target.value)}
          ></textarea>
        </div>
      ))}
      <button onClick={addSlide}>Add Slide</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PitchDeck;
