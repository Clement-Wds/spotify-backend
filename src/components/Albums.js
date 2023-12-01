import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';

const Albums = () => {
  const [albums, setalbums] = useState([]);

  useEffect(() => {
    const fetchalbums = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/albums');
        setalbums(response.data);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchalbums();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        {albums.map((album, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              as={Link}
              to={`/album/edit/${album.id}`}
              style={{cursor: 'pointer'}}>
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title className="text-center">{album.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Albums;
