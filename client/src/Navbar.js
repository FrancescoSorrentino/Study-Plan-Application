
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { LogoutButton } from './Login';
function Nav(props){
    return(
        <Navbar bg="dark" variant="dark">
            <Container >
            <Navbar.Brand href='/'>
            <i className="bi bi-mortarboard"></i>{' '}
                MyCourses
            </Navbar.Brand>
            <div>
                {props.loggedIn ? <LogoutButton logout={props.doLogOut} user={props.user} /> : false}
            </div>
            </Container>
        </Navbar>
    )
}

export default Nav;