import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from './Layout'
import { LoginForm } from "./Login";
import { Routes, Route, BrowserRouter as Router, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListaPiano, PianoStudiForm } from "./PianoStudi";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from './API';

function App(){
  return(
    <Router>
      <App2/>
    </Router>
  )
}

function App2() {
  const [corsi, setCorsi] = useState([]);
  const [tipoPiano, setTipo] = useState('')
  const [corsipiano, setCorsipiano] = useState([])
  const [loggedIn, setLoggedIn] = useState(false);
  const [dirty, setDirty] = useState(false) 
  const [user, setUser] = useState({});
  const [message, setMessage] = useState();
  const navigate = useNavigate()

  function handleError(err) {
    setMessage(err)
  }

  useEffect(() => {
    API.getAllCourses()
      .then( (courses) => { setCorsi(courses);} )
      .catch( err => handleError(err))
}, [])

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        const tipo = user.tipo ? user.tipo : ''
        setTipo(tipo)
        setUser(user);
        setLoggedIn(true);
        navigate('/')
      } catch(err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);


  useEffect(() => {
    if(loggedIn && tipoPiano){
      API.getPlan()
      .then((plan) => { setTipo(plan.tipo); setCorsipiano(plan.courses); setDirty(false); })
      .catch( err => handleError(err))
      API.getAllCourses()
      .then( (courses) => { setCorsi(courses);} )
      .catch( err => handleError(err))
    }
  }, [loggedIn, dirty, tipoPiano])


  const addCorso = (corso) => {
    setCorsipiano(oldCorsi => [...oldCorsi, corso]);
  }

  const annulla = () =>{
    setDirty(true);
    navigate('/')
  }

  const deleteCorso = (codice) => {
    if(!corsipiano.find(e => e.propedeutica===codice)){
      //setMessage('')
      setCorsipiano(corsipiano.filter((it) => it.codice != codice));
      return ''
    }
    else{
      return 'Vincolo di propedeuticità non rispettato!'
    }
  }

  const addPiano = (type) => {
    API.addPlan(type, corsipiano)
    .then(() => {
      setTipo(type)
      setDirty(true);
      navigate('/');
    })
    .catch(err =>{
      handleError(err);
    })
  }

  const updatePiano = (type) => {
    API.updatePlan(type, corsipiano)
    .then(() => {
      setDirty(true);
      navigate('/');
    })
    .catch(err =>{
      handleError(err);
    })
  }

  const deletePiano = () => {
    API.deletePlan()
    .then(() => {
      setTipo('')
      setCorsipiano([])
      setDirty(true);
      navigate('/');
    })
    .catch(err =>{
      handleError(err);
    })
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then( user => {
        setTipo(user.tipo ? user.tipo : '');
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
        let message = 'Welcome! ' + user.name
        log(message)
      })
      .catch(err => {
        setMessage(err);
      }
        )

      return message
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setTipo('');
    setCorsipiano([])
    navigate('/')
  
  
  }
  /////LOGIN IN TOAST//////
  const log = (m) => toast.success(m, {
    theme: "dark",
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
 ///////////////////////
 
  return (
    <>
      <Routes>
        <Route path='/' element = {<Layout add={addCorso} doLogOut={doLogOut} loggedIn={loggedIn} user={user} piano={corsipiano} corsi={corsi} />}>
          <Route path='/' element={loggedIn ? <ListaPiano deletePiano={deletePiano} corsipiano={corsipiano} tipo={tipoPiano} /> : <Navigate to = '/login'/> }/>
          <Route path='/login' element = { <LoginForm login = {doLogIn}/>}/>
          <Route path='/add' element ={<PianoStudiForm errorMsg= {message} addPlan={addPiano} delete={deleteCorso} corsipiano={corsipiano} tipo={tipoPiano} />} />
          <Route path='/update' element ={<PianoStudiForm annulla={annulla} errorMsg= {message} addPlan={updatePiano} delete={deleteCorso} corsipiano={corsipiano} tipo={tipoPiano} />} />
        </Route>
      </Routes>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          transition={Slide}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  );
}


export default App;
