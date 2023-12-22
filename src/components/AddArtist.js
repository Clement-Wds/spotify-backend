import React, {useState} from 'react';
import axios from 'axios';
import {Container, Form, Button, Card} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const AddArtistPage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://spotify-api-eosin-theta.vercel.app/api/artist',
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        alert('Artiste ajouté avec succès !');
      } else {
        alert("Erreur lors de l'ajout de l'artiste");
      }
    } catch (error) {
      alert('Une erreur est survenue', error);
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
              Ajouter un artiste
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default AddArtistPage;
