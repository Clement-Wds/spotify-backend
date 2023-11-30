import React, {useState} from 'react';
import axios from 'axios';
import {Container, Form, Button, Card} from 'react-bootstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Connexion réussie !');
      } else {
        alert('Erreur de connexion');
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
            <Form.Label>Nom d'utilisateur :</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe :</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Se connecter
            </Button>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
