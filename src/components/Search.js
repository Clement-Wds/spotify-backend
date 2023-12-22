import {useEffect, useRef, useState} from 'react';
import {Container, Card, Form, Col, Modal, Button} from 'react-bootstrap';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const SearchArtist = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState({musics: [], albums: [], artists: []});
  const [isLoading, setIsLoading] = useState(false);
  const callRef = useRef(null);
  const [showArtist, setShowArtist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artists, setArtists] = useState([]);

  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);

  const [showMusic, setShowMusic] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musics, setMusics] = useState([]);

  const handleClose = () => {
    setShowArtist(false);
    setShowAlbum(false);
    setShowMusic(false);
  };
  const navigate = useNavigate();

  const handleShowArtist = artistId => {
    setSelectedArtist(artistId);
    setShowArtist(true);
  };
  const handleShowAlbum = albumId => {
    setSelectedAlbum(albumId);
    setShowAlbum(true);
  };
  const handleShowMusic = musicId => {
    setSelectedMusic(musicId);
    setShowMusic(true);
  };
  const fetchImages = async data => {
    for (let artist of data.artists) {
      const albumsResponse = await axios.get(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${artist.id}/albums`,
      );
      if (albumsResponse.data.length > 0) {
        artist.albumImage = `https://spotify-api-eosin-theta.vercel.app/api/album/image/${albumsResponse.data[0].id}`;
      }
    }
    for (let album of data.albums) {
      const albumsResponse = await axios.get(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${album.artist_id}/albums`,
      );
      if (albumsResponse.data.length > 0) {
        album.albumImage = `https://spotify-api-eosin-theta.vercel.app/api/album/image/${albumsResponse.data[0].id}`;
      }
    }
    for (let music of data.musics) {
      const albumsResponse = await axios.get(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${music.artist_id}/albums`,
      );
      if (albumsResponse.data.length > 0) {
        music.albumImage = `https://spotify-api-eosin-theta.vercel.app/api/album/image/${albumsResponse.data[0].id}`;
      }
    }
    return data;
  };

  useEffect(() => {
    clearTimeout(callRef.current);
    if (input.length === 0) {
      setIsLoading(false);
    }
    if (input.length > 0) {
      setIsLoading(true);
      callRef.current = setTimeout(() => {
        axios({
          method: 'GET',
          url: `https://spotify-api-eosin-theta.vercel.app/api/search?q=${input}`,
        })
          .then(async res => {
            setIsLoading(false);
            const dataWithImages = await fetchImages(res.data);
            setData(dataWithImages);
          })
          .catch(err => {
            setIsLoading(false);
            alert('une erreur est survenue', err);
          });
      }, 300);
    } else {
      // Si l'input est vide, réinitialisez les données
      setData({musics: [], albums: [], artists: []});
    }
  }, [input]);

  const deleteArtist = async artistId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://spotify-api-eosin-theta.vercel.app/api/artist/${artistId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        // Supprimer l'artiste de l'état local après la suppression réussie
        setArtists(artists.filter(artist => artist.id !== artistId));
        // Fermer la modale
        handleClose();
        setInput('');
      }
    } catch (error) {
      alert(
        "Une erreur est survenue lors de la suppression de l'artiste",
        error,
      );
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        navigate('/');
      }
    }
  };
  const deleteAlbum = async albumId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://spotify-api-eosin-theta.vercel.app/api/album/${albumId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        // Supprimer l'album de l'état local après la suppression réussie
        setAlbums(albums.filter(album => album.id !== albumId));
        // Fermer la modale
        handleClose();
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la suppression de l'album", error);
      if (error.response && error.response.status === 403) {
        // Si le statut de la réponse est 403, rediriger vers la page de connexion
        navigate('/');
      }
    }
  };
  const deleteMusic = async musicId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://spotify-api-eosin-theta.vercel.app/api/music/${musicId}`,
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
      alert(
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
      <h2>Rechercher :</h2>
      <Form.Control
        onChange={e => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search..."
      />
      <div className="mt-3">
        {isLoading ? <div className="spinner-border text-primary"></div> : null}
        {data.artists.length > 0 && <h2>Artists</h2>}

        {data.artists.map((artist, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShowArtist(artist.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img
                variant="top"
                src={artist.albumImage || 'https://via.placeholder.com/150'}
                style={{width: '100%', height: '250px', objectFit: 'cover'}}
              />

              <Card.Body>
                <Card.Title className="text-center">{artist.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Modal show={showArtist} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Choisissez une action</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column align-items-center">
            <Button
              as={Link}
              to={`/artist/edit/${selectedArtist}`}
              variant="warning"
              className="mb-3"
              style={{width: '80%'}}>
              Modifier l'artiste
            </Button>
            <Button
              onClick={() => deleteArtist(selectedArtist)}
              variant="danger"
              style={{width: '80%'}}>
              Supprimer l'artiste
            </Button>
          </Modal.Body>
        </Modal>
        {data.albums.length > 0 && <h2>Albums</h2>}
        {data.albums.map((album, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShowAlbum(album.id)}
              style={{cursor: 'pointer'}}>
              <Card.Img
                variant="top"
                src={album.albumImage || 'https://via.placeholder.com/150'}
                style={{width: '100%', height: '250px', objectFit: 'cover'}}
              />

              <Card.Body>
                <Card.Title className="text-center">{album.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Modal show={showAlbum} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Choisissez une action</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column align-items-center">
            <Button
              as={Link}
              to={`/album/edit/${selectedAlbum}`}
              variant="warning"
              className="mb-3"
              style={{width: '80%'}}>
              Modifier l'album
            </Button>
            <Button
              onClick={() => deleteAlbum(selectedAlbum)}
              variant="danger"
              style={{width: '80%'}}>
              Supprimer l'album
            </Button>
          </Modal.Body>
        </Modal>
        {data.musics.length > 0 && <h2>Musiques</h2>}
        {data.musics.map((music, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              onClick={() => handleShowMusic(music.id)}
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
        <Modal show={showMusic} onHide={handleClose}>
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
      </div>
    </Container>
  );
};

export default SearchArtist;
