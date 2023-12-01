import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddAlbumPage from './pages/AddAlbumPage';
import AddArtistPage from './pages/AddArtistPage';
import AddMusicPage from './pages/AddMusicPage';

import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/music/create" element={<AddMusicPage />} />
        <Route path="/album/create" element={<AddAlbumPage />} />
        <Route path="/artist/create" element={<AddArtistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
