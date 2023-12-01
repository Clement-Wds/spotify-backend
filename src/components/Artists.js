import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';

const Artists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <Container>
      <h1 className="text-center my-4">Tout les artistes</h1>
      <Row className="justify-content-center">
        {artists.map((artist, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              as={Link}
              to={`/artist/edit/${artist.id}`}
              style={{cursor: 'pointer'}}>
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title className="text-center">{artist.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Artists;
