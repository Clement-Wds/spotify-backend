import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Card, Form, Button, Row, Col} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
const ModifyAlbum = () => {
  const [title, setTitle] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState('');
  const [coverImage, setCoverImage] = useState(null); // Ajout d'un état pour l'image de couverture
  const [musics, setMusics] = useState([]); // Ajout d'un état pour les musiques

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

    const fetchMusics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/album/${id}/musics`,
        );
        const sortedMusics = response.data.sort((a, b) => {
          if (a.trackNumber === null && b.trackNumber === null) {
            return a.title.localeCompare(b.title);
          }
          if (a.trackNumber === null) return 1;
          if (b.trackNumber === null) return -1;
          return a.trackNumber - b.trackNumber;
        });
        setMusics(sortedMusics); // Mettre à jour l'état des musiques lorsque vous récupérez les données des musiques
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchAlbum();
    fetchMusics();
  }, [id]);

  // Function to handle the end of a drag event
  const handleDragEnd = result => {
    if (!result.destination) return;

    const items = Array.from(musics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMusics(items);
  };

  // useEffect(() => {
  //   console.log(musics[id]);
  // });
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
        for (let i = 0; i < musics.length; i++) {
          await axios.put(
            `http://localhost:3001/api/music/${musics[i].id}`,
            {
              trackNumber: i + 1, // Mettre à jour la trackNumber en fonction de l'ordre d'affichage
              artist_id: artistId, // Inclure l'id de l'artiste
              album_id: id, // Inclure l'id de l'album
            },
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );
        }
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
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Card className="p-4 mb-4">
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
        </Col>
        <Col xs lg="6">
          <Card className="p-4">
            <h5>Musiques de l'album :</h5>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="musics">
                {provided => (
                  <ol {...provided.droppableProps} ref={provided.innerRef}>
                    {musics.map((music, index) => (
                      <Draggable
                        key={music.id}
                        draggableId={String(music.id)}
                        index={index}>
                        {provided => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}>
                            {music.title}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModifyAlbum;
