import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Card, Form, Button} from 'react-bootstrap';

const ModifyMusic = () => {
  const [title, setTitle] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/music/${id}`,
        );
        setTitle(response.data.title);
        setAlbumId(response.data.album_id); // Update albumId when you fetch the album data
        setArtistId(response.data.artist_id); // Update artistId when you fetch the album data
      } catch (error) {
        alert('Une erreur est survenue', error);
      }
    };

    fetchMusic();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/music/${id}`,
        {title, artist_id: artistId, album_id: albumId}, // Include artist_id in your request body
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      navigate('/home');
    } catch (error) {
      alert(
        "Une erreur est survenue lors de la modification de l'album",
        error,
      );
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        localStorage.removeItem('token');

        navigate('/');
      }
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: '100vh'}}>
      <Card className="p-4" style={{width: '300px'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la musique :</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Modifier la musique
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default ModifyMusic;
