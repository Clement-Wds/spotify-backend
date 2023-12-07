import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Card, Form, Button} from 'react-bootstrap';

const ModifyAlbum = () => {
  const [title, setTitle] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState('');
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/album/${id}`,
        );
        setTitle(response.data.title);
        setArtistId(response.data.artist_id); // Update artistId when you fetch the album data
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchAlbum();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/album/${id}`,
        {title, artist_id: artistId}, // Include artist_id in your request body
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      navigate('/home');
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la modification de l'album",
        error,
      );
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: '100vh'}}>
      <Card className="p-4" style={{width: '300px'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de l'album :</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Modifier l'album
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default ModifyAlbum;
