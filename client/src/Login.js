import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';


function LoginForm(props) {
    const [email, setEmail] = useState('j@p.it'); //almeno tre film ed assegnare
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState('') ;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { email, password };
        let valid = true;
        if(email === '' || password === '')
            valid = false;
        if (!(re.test(email)) || email.length<3 || password.length<3){
            valid=false;
        }
        if(valid)
        {
          let x = props.login(credentials)
          
          setErrorMessage(x)
        }
        else {
          setErrorMessage('Invalid username and/or password.')
        }
    };

return (
    <Container>

        <Row>
            <Col>
                <h2>Login</h2>
                {errorMessage && errorMessage.length> 0 ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert> : false}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='username'>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type='email' value={email} onChange={ev => setEmail(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <br></br>
                    <Button type="submit">Login</Button>
                </Form>
            </Col>
        </Row>
    </Container>)
}

function LogoutButton(props) {
return(
  <Col>
    <span style={{color: 'white'}}>User:  {props.user?.name}</span>{' /t'}<Button variant="outline-info" onClick={props.logout}>Logout</Button>
  </Col>
)
}

export { LoginForm, LogoutButton };