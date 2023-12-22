import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Card, Form, Button} from 'react-bootstrap';

const ModifyArtist = () => {
  const [name, setName] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(
          `https://spotify-api-eosin-theta.vercel.app/api/artist/${id}`,
        );
        setName(response.data.name);
      } catch (error) {
        alert('Une erreur est survenue', error);
      }
    };

    fetchArtist();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${id}`,
        {name},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      navigate('/home');
    } catch (error) {
      alert(
        "Une erreur est survenue lors de la modification de l'artiste",
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
            <Form.Label>Nom de l'artiste :</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Modifier l'artiste
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default ModifyArtist;
