import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Button} from 'react-bootstrap';

const Header = () => {
  const handleSignOut = () => {
    localStorage.removeItem('token');
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      style={{display: 'flex', justifyContent: 'space-between'}}>
      <Navbar.Brand as={Link} to="/">
        Spotify BackOffice
      </Navbar.Brand>
      <div>
        <Button
          variant="outline-info"
          as={Link}
          to="/artist/create"
          style={{margin: '0 10px'}}>
          Créer un artiste
        </Button>
        <Button
          variant="outline-info"
          as={Link}
          to="/album/create"
          style={{margin: '0 10px'}}>
          Créer un album
        </Button>
        <Button
          variant="outline-info"
          as={Link}
          to="/music/create"
          style={{margin: '0 10px'}}>
          Créer une musique
        </Button>
        <Button
          variant="outline-danger"
          onClick={handleSignOut}
          as={Link}
          to="/Login"
          style={{margin: '0 10px'}}>
          Se déconnecter
        </Button>
      </div>
    </Navbar>
  );
};

export default Header;
