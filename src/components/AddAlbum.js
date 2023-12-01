import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container, Form, Button, Card} from 'react-bootstrap';

const AddAlbumPage = () => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await axios.get('http://localhost:3001/api/artists');
      setArtists(response.data);
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

      const response = await axios.post(
        'http://localhost:3001/api/album',
        {
          title,
          artist_id: artistIdToUse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        alert('Album ajouté avec succès !');
      } else {
        alert("Erreur lors de l'ajout de l'album");
      }
    } catch (error) {
      console.error('Une erreur est survenue', error);
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
