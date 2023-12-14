import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddAlbumPage from './pages/AddAlbumPage';
import AddArtistPage from './pages/AddArtistPage';
import AddMusicPage from './pages/AddMusicPage';
import ModifyArtist from './pages/ModifyArtistPage';
import ModifyAlbum from './pages/ModifyAlbumPage';
import ModifyMusic from './pages/ModifyMusicPage';
import Search from './pages/SearchPage';

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
        <Route path="/artist/edit/:id" element={<ModifyArtist />} />
        <Route path="/album/edit/:id" element={<ModifyAlbum />} />
        <Route path="/music/edit/:id" element={<ModifyMusic />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
