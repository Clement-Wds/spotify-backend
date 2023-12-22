import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Row, Col, Card, Modal, Button} from 'react-bootstrap';
const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const handleClose = () => setShow(false);
  const navigate = useNavigate();

  const handleShow = artistId => {
    setSelectedArtist(artistId);
    setShow(true);
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(
          'https://spotify-api-eosin-theta.vercel.app/api/artists',
        );
        const artistsData = response.data;
        for (let artist of artistsData) {
          const albumsResponse = await axios.get(
            `https://spotify-api-eosin-theta.vercel.app/api/artist/${artist.id}/albums`,
          );
          if (albumsResponse.data.length > 0) {
            artist.albumImage = `https://spotify-api-eosin-theta.vercel.app/api/album/image/${albumsResponse.data[0].id}`;
          }
        }
        setArtists(artistsData);
      } catch (error) {
        alert('Une erreur est survenue', error);
      }
    };

    fetchArtists();
  }, []);
  const deleteArtist = async artistId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${artistId}`,
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
      alert(
        "Une erreur est survenue lors de la suppression de l'artiste",
        error,
      );
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        navigate('/');
      }
    }
  };
  return (
    <Container>
      <h1 className="text-center my-4">Tout les artistes ({artists.length})</h1>
      <Row className="justify-content-center">
        {artists.map((artist, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShow(artist.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img
                variant="top"
                src={artist.albumImage || 'https://via.placeholder.com/150'}
                style={{width: '100%', height: '250px', objectFit: 'cover'}}
              />

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
