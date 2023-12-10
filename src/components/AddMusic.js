import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container, Card, Form, Button, Spinner} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const AddMusic = () => {
  const [title, setTitle] = useState('');
  const [newArtist, setNewArtist] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');
  const [artistId, setArtistId] = useState(null);
  const [newAlbum, setNewAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [albumId, setAlbumId] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [coverImage, setCoverImage] = useState(null); // Ajout d'un état pour l'image de couverture

  useEffect(() => {
    const fetchAlbums = async () => {
      if (artistId) {
        const response = await axios.get(
          `http://localhost:3001/api/artist/${artistId}/albums`,
        );
        setAlbums(response.data);
        if (response.data.length > 0) {
          // Check if the artist list is not empty
          setAlbumId(response.data[0].id); // Set artistId to the first artist in the list
        }
      } else {
        setAlbums([]);
      }
    };
    fetchAlbums();
  }, [artistId]);

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await axios.get('http://localhost:3001/api/artists');
      setArtists(response.data);
      if (response.data.length > 0) {
        // Check if the artist list is not empty
        setArtistId(response.data[0].id); // Set artistId to the first artist in the list
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    console.log(albumId);
  });
  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

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

      let albumIdToUse = albumId;
      if (newAlbum) {
        const formDataNewAlbum = new FormData();
        formDataNewAlbum.append('title', newAlbumTitle);
        formDataNewAlbum.append('artist_id', artistIdToUse);
        formDataNewAlbum.append('coverImagePath', coverImage);
        const albumResponse = await axios.post(
          'http://localhost:3001/api/album',
          formDataNewAlbum,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data', // Définition du type de contenu pour l'envoi de fichiers
            },
          },
        );
        albumIdToUse = albumResponse.data.id;
      }

      // Création d'un objet FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist_id', artistIdToUse);
      formData.append('album_id', albumIdToUse);
      formData.append('file', file); // Ajout du fichier

      const response = await axios.post(
        'http://localhost:3001/api/music',
        formData, // Envoi de l'objet FormData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Ajout du type de contenu
          },
        },
      );

      if (response.data) {
        alert('Musique ajoutée avec succès !');
        navigate('/home');
      } else {
        alert("Erreur lors de l'ajout de la musique");
      }
    } catch (error) {
      console.error('Une erreur est survenue', error);
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: '100vh'}}>
      <Card className="p-4" style={{width: '300px'}}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Titre de la musique :</Form.Label>
            <Form.Control
              type="text"
              value={title}
              name="title"
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Nouvel artiste"
              checked={newArtist}
              onChange={e =>
                setNewArtist(e.target.checked) & setNewAlbum(e.target.checked)
              }
            />
          </Form.Group>
          {newArtist ? (
            <Form.Group className="mb-3">
              <Form.Label>Nom de l'artiste :</Form.Label>
              <Form.Control
                type="text"
                value={newArtistName}
                name="artist_id"
                onChange={e => setNewArtistName(e.target.value)}
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Artiste :</Form.Label>
              <Form.Select
                value={artistId}
                name="artist_id"
                onChange={e => setArtistId(parseInt(e.target.value, 10))}>
                {artists.map(artist => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Nouvel album"
              checked={newAlbum}
              onChange={e => setNewAlbum(e.target.checked)}
            />
          </Form.Group>
          {newAlbum ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Titre de l'album :</Form.Label>
                <Form.Control
                  type="text"
                  value={newAlbumTitle}
                  name="album_id"
                  onChange={e => setNewAlbumTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image de couverture :</Form.Label>
                <Form.Control
                  type="file"
                  onChange={e => setCoverImage(e.target.files[0])} // Mise à jour de l'état de l'image de couverture lorsqu'un fichier est sélectionné
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Album :</Form.Label>
              <Form.Select
                value={albumId}
                name="album_id"
                onChange={e => setAlbumId(parseInt(e.target.value, 10))}>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Chemin du fichier :</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={e => setFile(e.target.files[0])} // Modification de la gestion du fichier
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Ajouter une musique'
              )}
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default AddMusic;
