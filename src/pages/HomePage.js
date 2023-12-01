import React from 'react';
import HeaderComponents from '../components/Header';
import ArtistsComponents from '../components/Artists';
import AlbumsComponents from '../components/Albums';

const HomePage = () => {
  return (
    <>
      <HeaderComponents />
      <br></br>
      <ArtistsComponents />
      <br></br>
      <AlbumsComponents />
    </>
  );
};

export default HomePage;
