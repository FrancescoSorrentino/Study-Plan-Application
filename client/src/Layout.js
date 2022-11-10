import { Col, Row} from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './Navbar';
import { ListaCorsi, ListaCorsiEditable } from './ListaCorsi';

function Layout(props) {
    const location = useLocation()
    return (
      <>
        <Nav doLogOut={props.doLogOut} loggedIn={props.loggedIn} user={props.user}/>
        <Row className='App'>
          <Col xs={5}>
            { (location.pathname=='/add' || location.pathname=='/update' ) ? <ListaCorsiEditable add ={props.add} corsi={props.corsi} piano={props.piano}/> : <ListaCorsi corsi={props.corsi} />} 
          </Col>
          <Col xs={7}>
            <Outlet/>
          </Col>
        </Row>
      </>
    );
  }

  export default Layout;