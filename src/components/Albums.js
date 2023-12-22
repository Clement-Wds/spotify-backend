import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Row, Col, Card, Modal, Button} from 'react-bootstrap';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = albumId => {
    setSelectedAlbum(albumId);
    setShow(true);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          'https://spotify-api-eosin-theta.vercel.app/api/albums',
        );
        setAlbums(response.data);
      } catch (error) {
        alert('Une erreur est survenue', error);
      }
    };

    fetchAlbums();
  }, []);
  const deleteAlbum = async albumId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://spotify-api-eosin-theta.vercel.app/api/album/${albumId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        // Supprimer l'album de l'état local après la suppression réussie
        setAlbums(albums.filter(album => album.id !== albumId));
        // Fermer la modale
        handleClose();
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la suppression de l'album", error);
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        navigate('/');
      }
    }
  };
  return (
    <Container>
      <h1 className="text-center my-4">Tout les albums ({albums.length})</h1>
      <Row className="justify-content-center">
        {albums.map((album, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShow(album.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img
                variant="top"
                src={`https://spotify-api-eosin-theta.vercel.app/api/album/image/${album.id}`}
                style={{width: '100%', height: '250px', objectFit: 'cover'}}
              />
              <Card.Body>
                <Card.Title className="text-center">{album.title}</Card.Title>
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
            to={`/album/edit/${selectedAlbum}`}
            variant="warning"
            block
            className="mb-3"
            style={{width: '80%'}}>
            Modifier l'album
          </Button>
          <Button
            onClick={() => deleteAlbum(selectedAlbum)}
            variant="danger"
            style={{width: '80%'}}>
            Supprimer l'album
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Albums;
