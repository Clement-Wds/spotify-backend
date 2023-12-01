import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';

const Musics = () => {
  const [musics, setmusics] = useState([]);

  useEffect(() => {
    const fetchmusics = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/musics');
        setmusics(response.data);
      } catch (error) {
        console.error('Une erreur est survenue', error);
      }
    };

    fetchmusics();
  }, []);

  return (
    <Container>
      <h1 className="text-center my-4">Toute les musiques</h1>
      <Row className="justify-content-center">
        {musics.map((music, index) => (
          <Col xs={6} md={3} key={index} className="mb-4">
            <Card
              as={Link}
              to={`/music/edit/${music.id}`}
              style={{cursor: 'pointer'}}>
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title className="text-center">{music.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Musics;
