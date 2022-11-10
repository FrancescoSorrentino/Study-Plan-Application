import { useState } from "react"
import { Alert, Button, ListGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

/***************** COMPONENTI LISTA ***********************/

function PianoStudiForm(props){
    
    const [tipo, setTipo] = useState(props.tipo ? props.tipo : false)
    const [errorMsg, setErrorMsg] = useState(props.errorMsg)
    const location = useLocation()
    const navigate = useNavigate()

    const sceltaTipo = (type) =>{
        setTipo(type);
    }

    function totCFU() {
        let sum=0;
            props.corsipiano.forEach(e =>{
                if(e.crediti)
                    sum+=e.crediti;
            })
        return sum
    }

    function deleteC(codice) {
        let x = props.delete(codice)
        setErrorMsg(x)
    }

    function handleAdd(){
        //check del il piano se ricade in una delle due tipologie.
        if((tipo === 'parttime' && (totCFU() >= 20 && totCFU() <= 40)) || ( tipo === 'fulltime' && (totCFU() >= 60 && totCFU() <= 80)) ){
            setErrorMsg('')
            props.addPlan(tipo)
            
        }
        else{
            setErrorMsg('Numero di CFU troppo basso o troppo alto! Controlla che sia nel range sopradescritto.')
        }
    }

    return(
        <>
           { !tipo ? <SelectTipo setTipo={sceltaTipo}/> : 
            <>
                <h3>Piano di Studi</h3>
                <h5>Clicca nei corsi a sinistra per aggiungerli al piano!</h5>
                <h5>CFU Tot: {totCFU()} {tipo==='parttime' ? "(minCFU: 20, maxCFU: 40)" : "(minCFU: 60, maxCFU: 80)" } </h5>
                {errorMsg && errorMsg.length>0 ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                <ListGroup variant="flush">
                    {props.corsipiano ? props.corsipiano.map((it,idx) => {
                        return <DeletableCorsi key={idx} delete={deleteC} {...it} />
                    }) : false}
                </ListGroup>
                <div className=' d-flex justify-content-evenly'>
                    <Button variant='dark' onClick={() => handleAdd()}>{location.pathname==='/add' ? 'Aggiungi Piano' : 'Aggiorna Piano'}</Button>
                    {location.pathname==='/add' ?
                    <Button variant='secondary' onClick={() => navigate('/')}>Indietro</Button> 
                        : 
                    <Button variant='secondary' onClick={() => props.annulla()}>Annulla</Button> }
                </div>
            </>
            }
        </>
    )
}

function ListaPiano(props){
    const navigate = useNavigate()
    function totCFU() {
        let sum=0;
            props.corsipiano.forEach(e =>{
                if(e.crediti)
                    sum+=e.crediti;
            })
        return sum
    }

    return(
        <>
            {!props.tipo ? <NotFound/> : 
            <>
                <h3>Piano di Studi</h3>
                <h5>Tipo: {props.tipo==='parttime' ? 'Part-Time' : 'Full-Time'}</h5>
                <h5>CFU Tot: {totCFU()}</h5>
                <ListGroup variant="flush">
                    {props.corsipiano ? props.corsipiano.map((it,idx) => {
                        return <Corsi key={idx} {...it} />
                    }) : false}
                </ListGroup>
                <div className=' d-flex justify-content-evenly'>
                <Button variant='dark' onClick={() => {navigate('/update')}}>Modifica piano</Button>
              
                <Button variant='danger'className='' onClick={() => {props.deletePiano()}}>Elimina Piano</Button>
                </div>
               
            </>
            }
        </>
    )
}
/******************************* COMPONENTI INTERMEDI  ********************************/

function SelectTipo(props){
    const [radioState, setRadio] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const navigate = useNavigate()
    function handleSubmit(event){
        event.preventDefault()
        if(radioState){
            setErrorMsg('')
            props.setTipo(radioState)
        }
        else{
            setErrorMsg('Seleziona uno dei due tipi')
        }
    }
    return(
        <>
            <Row>
                <h2>Seleziona il tipo di piano di studi!</h2>
            </Row>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            <br></br>
            <Form onSubmit={e => handleSubmit(e)}>
            <Row className='justify-content-center'>
                <Col xs={3}>
                    
                        
                        <Form.Check 
                            type="radio"
                            id="1"
                            name="group1"
                            label="full-time"
                            onChange={(e) => 
                                !e.checked ? setRadio('fulltime') : false
                             }
                        />
                        <Form.Check 
                            type="radio"
                            name="group1"
                            label="part-time"
                            id="0"
                            onChange={(e) => 
                                !e.checked ? setRadio('parttime') : false
                             }
                        />
                        </Col>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="d-flex justify-content-evenly">
                            <Button variant="dark" type='submit'>
                            Submit
                            </Button>
                            <Button variant="secondary" onClick={() =>{navigate('/')}}>
                            Annulla
                            </Button>
                        </div>
                    
                
            </Row>
        </Form>
        </>
    )
}

function NotFound(){

    const navigate = useNavigate();
    return(
        <>
            <h2>Whoops!</h2>
            <h4> Sembra che non è stato trovato alcun piano di studi, se vuoi crearne uno clicca su "Crea un nuovo piano".</h4>
            <br></br>
            <Button variant='dark' onClick={() => navigate('/add')}>Crea un nuovo piano</Button>
        </>
    )

}

/*******************************************************************************************/
/********************************* COMPONENTI RIGA *****************************************/

function Corsi(props){
    return(
        <ListGroup.Item>
            <div className="d-flex w-100 justify-content-between">
                        <span className="col-2">{props.nome}</span>  
                        <span className="col-2">{props.codice }</span>  
                        <span className="col-2">{props.crediti}</span>  
                        <span className="col-2">{props.nstudenti}</span>  
                        <span className="col-2">{props.maxstudenti}</span> 
                    </div>
        </ListGroup.Item>
    )
}

function DeletableCorsi(props){
    return(
        <ListGroup.Item>
            <div className="d-flex w-100 justify-content-between">
                        <span className="col-2">{props.nome}</span>  
                        <span className="col-2">{props.codice }</span>  
                        <span className="col-2">{props.crediti}</span>  
                        <span className="col-2">{props.nstudenti}</span>  
                        <span className="col-2">{props.maxstudenti}</span> 
                        <span > 
                            <Button size= '' className='rounded-circle pb-2' variant='outline-danger' onClick={() =>{props.delete(props.codice)}}>
                                <i className="bi bi-file-earmark-x"></i>
                            </Button>
                        </span>
                    </div>
        </ListGroup.Item>
    )
}

/******************************************************************************************/


export {PianoStudiForm, ListaPiano, SelectTipo}

