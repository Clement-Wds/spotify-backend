import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Card, Form, Button} from 'react-bootstrap';

const ModifyAlbum = () => {
  const [title, setTitle] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState('');
  const [coverImage, setCoverImage] = useState(null); // Ajout d'un état pour l'image de couverture

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
      const formData = new FormData(); // Utilisation de FormData pour envoyer l'image
      formData.append('title', title);
      formData.append('artist_id', artistId);
      if (coverImage) {
        formData.append('coverImagePath', coverImage); // Ajout de l'image de couverture si une nouvelle image a été sélectionnée
      }

      const response = await axios.put(
        `http://localhost:3001/api/album/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Définition du type de contenu pour l'envoi de fichiers
          },
        },
      );

      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la modification de l'album",
        error,
      );
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
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
            <Form.Label>Nom de l'album :</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image de couverture :</Form.Label>
            <Form.Control
              type="file"
              onChange={e => setCoverImage(e.target.files[0])} // Mise à jour de l'état de l'image de couverture lorsqu'un fichier est sélectionné
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
