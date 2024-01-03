import React from 'react';

const Home = () => {
  return (
    <div className="container">
      <section id="song-cards">
        <div className="song-card">
          <img src="/src/assets/react.svg" alt="Song 1" />
          <p>Song Title 1</p>
          <p>Artist Name 1</p>
        </div>
        <div className="song-card">
          <img src="/src/assets/react.svg" alt="Song 2" />
          <p>Song Title 2</p>
          <p>Artist Name 2</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

