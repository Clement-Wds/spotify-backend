import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Container, Row, Col, Card, Modal, Button} from 'react-bootstrap';

const Musics = () => {
  const [musics, setMusics] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = musicId => {
    setSelectedMusic(musicId);
    setShow(true);
  };
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/musics');
        const musicsData = response.data;
        for (let music of musicsData) {
          const albumResponse = await axios.get(
            `http://localhost:3001/api/music/${music.id}/album`,
          );
          if (albumResponse.data) {
            music.albumImage = `http://localhost:3001/api/album/image/${albumResponse.data.id}`;
          }
        }
        setMusics(musicsData);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchMusics();
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
        // Supprimer la musique de l'état local après la suppression réussie
        setMusics(musics.filter(music => music.id !== musicId));
        // Fermer la modale
        handleClose();
      }
    } catch (error) {
      console.error(
        'Une erreur est survenue lors de la suppression de la musique',
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
      <h1 className="text-center my-4">Toute les musiques ({musics.length})</h1>
      <Row className="justify-content-center">
        {musics.map((music, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShow(music.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img
                variant="top"
                src={music.albumImage || 'https://via.placeholder.com/150'}
                style={{width: '100%', height: '250px', objectFit: 'cover'}}
              />
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
            onClick={() => {
              handleClose();
              navigate(`/music/edit/${selectedMusic}`);
            }}
            variant="warning"
            className="mb-3"
            style={{width: '80%'}}>
            Modifier la musique
          </Button>
          <Button
            onClick={() => deleteMusic(selectedMusic)}
            variant="danger"
            style={{width: '80%'}}>
            Supprimer la musique
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Musics;
