import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Card, Modal, Button} from 'react-bootstrap';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = artistId => {
    setSelectedArtist(artistId);
    setShow(true);
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchArtists();
  }, []);
  const deleteArtist = async artistId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3001/api/artist/${artistId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        // Supprimer l'artiste de l'état local après la suppression réussie
        setArtists(artists.filter(artist => artist.id !== artistId));
        // Fermer la modale
        handleClose();
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la suppression de l'artiste",
        error,
      );
    }
  };
  return (
    <Container>
      <h1 className="text-center my-4">Tout les artistes</h1>
      <Row className="justify-content-center">
        {artists.map((artist, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShow(artist.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title className="text-center">{artist.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choisissez une action</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Button
            as={Link}
            to={`/artist/edit/${selectedArtist}`}
            variant="warning"
            className="mb-3"
            style={{width: '80%'}}>
            Modifier l'artiste
          </Button>
          <Button
            onClick={() => deleteArtist(selectedArtist)}
            variant="danger"
            style={{width: '80%'}}>
            Supprimer l'artiste
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Artists;
