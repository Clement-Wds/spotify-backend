import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container, Form, Button, Card} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const AddAlbumPage = () => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');
  const [coverImage, setCoverImage] = useState(null); // Ajout d'un état pour l'image de couverture
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await axios.get('http://localhost:3001/api/artists');
      setArtists(response.data);
      if (response.data.length > 0) {
        setArtistId(response.data[0].id);
      }
    };
    fetchArtists();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      let artistIdToUse = artistId;
      if (newArtist) {
        const artistResponse = await axios.post(
          'http://localhost:3001/api/artist',
          {
            name: newArtistName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        artistIdToUse = artistResponse.data.id;
      }

      const formData = new FormData(); // Utilisation de FormData pour envoyer l'image
      formData.append('title', title);
      formData.append('artist_id', artistIdToUse);
      formData.append('coverImagePath', coverImage); // Ajout de l'image de couverture

      const response = await axios.post(
        'http://localhost:3001/api/album',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Définition du type de contenu pour l'envoi de fichiers
          },
        },
      );

      if (response.data) {
        alert('Album ajouté avec succès !');
      } else {
        alert("Erreur lors de l'ajout de l'album");
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
            <Form.Label>Titre de l'album :</Form.Label>
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
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Nouvel artiste"
              checked={newArtist}
              onChange={e => setNewArtist(e.target.checked)}
            />
          </Form.Group>
          {newArtist ? (
            <Form.Group className="mb-3">
              <Form.Label>Nom de l'artiste :</Form.Label>
              <Form.Control
                type="text"
                value={newArtistName}
                onChange={e => setNewArtistName(e.target.value)}
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Artiste :</Form.Label>
              <Form.Select
                value={artistId}
                onChange={e => setArtistId(parseInt(e.target.value, 10))}>
                {artists.map(artist => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Ajouter un album
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default AddAlbumPage;
