import React, {useState} from 'react';
import HeaderComponents from '../components/Header';
import ArtistsComponents from '../components/Artists';
import AlbumsComponents from '../components/Albums';
import MusicsComponents from '../components/Musics';
import {ButtonGroup, Button} from 'react-bootstrap';

const HomePage = () => {
  const [selectedComponent, setSelectedComponent] = useState('artists');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'artists':
        return <ArtistsComponents />;
      case 'albums':
        return <AlbumsComponents />;
      case 'musics':
        return <MusicsComponents />;
      default:
        return <ArtistsComponents />;
    }
  };

  return (
    <>
      <HeaderComponents />
      <ButtonGroup
        className="mt-3 d-flex justify-content-center"
        style={{fontSize: '1.25rem'}}>
        <Button
          variant="outline-primary"
          onClick={() => setSelectedComponent('artists')}
          className="px-4">
          Artistes
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => setSelectedComponent('albums')}
          className="px-4">
          Albums
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => setSelectedComponent('musics')}
          className="px-4">
          Musiques
        </Button>
      </ButtonGroup>
      <br></br>
      {renderComponent()}
    </>
  );
};

export default HomePage;
