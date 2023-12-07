import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Card, Modal, Button} from 'react-bootstrap';

const Musics = () => {
  const [musics, setmusics] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = musicId => {
    setSelectedMusic(musicId);
    setShow(true);
  };
  useEffect(() => {
    const fetchmusics = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/musics');
        setmusics(response.data);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchmusics();
  }, []);
  const deleteMusic = async musicId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3001/api/music/${musicId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        // Supprimer l'artiste de l'état local après la suppression réussie
        setmusics(musics.filter(music => music.id !== musicId));
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
      <h1 className="text-center my-4">Toute les musiques</h1>
      <Row className="justify-content-center">
        {musics.map((music, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              as={Link}
              to={`/music/edit/${music.id}`}
              onClick={() => handleShow(music.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title className="text-center">{music.title}</Card.Title>
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
            to={`/music/edit/${selectedMusic}`}
            variant="warning"
            className="mb-3"
            style={{width: '80%'}}>
            Modifier l'artiste
          </Button>
          <Button
            onClick={() => deleteMusic(selectedMusic)}
            variant="danger"
            style={{width: '80%'}}>
            Supprimer l'artiste
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Musics;
