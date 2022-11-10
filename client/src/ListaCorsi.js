
import { Accordion, Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row,Col} from 'react-bootstrap';



/***************** COMPONENTI LISTA ***********************/

function ListaCorsi(props){
    return(
        <>
            <h2 className='text-center'>
                Lista Corsi
            </h2>
            <Accordion defaultActiveKey="0"  alwaysOpen flush>
            <Accordion.Item>
                <div className="d-flex w-100 justify-content-between">
                            <h5 className="col-2">Nome</h5>  
                            <h5 className="col-2">Codice</h5>  
                            <h5 className="col-2">Crediti</h5>  
                            <h5 className="col-2">N. Studenti</h5>  
                            <h5 >Max Studenti</h5>
                            <h5 className='col-1' > </h5>  
                </div>
            </Accordion.Item>
                {props.corsi.map((it,idx) =>{
                    return <RigaCorso key={idx} idx={idx} {...it} />
                })}
            </Accordion>
        </>
    )
}


function ListaCorsiEditable(props){
    return(
        <>
            <h2 className='text-center'>
                  Lista Corsi
            </h2>
            <Accordion defaultActiveKey="0"  alwaysOpen flush>
            <Accordion.Item>
                <div className="d-flex w-100 justify-content-between">
                                <h5 className="col-2">Nome</h5>  
                                <h5 className="col-2">Codice</h5>  
                                <h5 className="col-2">Crediti</h5>  
                                <h5 className="col-2">N. Studenti</h5>  
                                <h5 >Max Studenti</h5>
                                <h5 className='col-2' > </h5>  
                </div>
            </Accordion.Item>
                {props.corsi.map((it,idx) => {
                    
                        
                        if(!props.piano.find(e =>e.codice===it.codice)){
                           
                            let type=false;
                            let v= it.inc.inc
                            let prop=it.propedeutica
                            //check propedeuticità 
                            if(!(props.piano.find(e =>e.codice===prop)) && !(prop===null) ){
                                type=1;
                            }
                            else if(it.maxstudenti && it.nstudenti>=it.maxstudenti){
                                //check se è piena
                                type=3;
                            }
                            else{
                                //check incompatibilità
                                v.forEach((code) => {
                                    if(props.piano.find(c =>c.codice===code)){
                                        
                                        type=2;
                                    }
                                })
                            }
                            return <RigaCorsoEditable key={idx} idx={idx} add={props.add} type={type} bol={true} {...it} />
                        }
                        else
                        { 
                            return <RigaCorsoEditable key={idx} idx={idx} add={props.add} type={true} bol={false} {...it} />
                        }
                })}
            </Accordion>
        </>
    )
}

/*********************************** COMPONENTI RIGA *******************************************/

function RigaCorso(props){
    return(
        <>
            <Accordion.Item eventKey={props.idx} >
                <Accordion.Header> 
                    <div className="d-flex w-100 justify-content-between">
                        <span className="col-2">{props.nome}</span>  
                        <span className="col-2">{props.codice }</span>  
                        <span className="col-2">{props.crediti}</span>  
                        <span className="col-2">{props.nstudenti}</span>  
                        <span className="col-2">{props.maxstudenti}</span> 
                        
                    </div>
                </Accordion.Header> 
                <Accordion.Body>
                    
                    Materie propedeutiche:<br></br> {props.propedeutica} <br></br>
                    Materie incompatibili:<br></br> {props.inc.inc.map(e => {return <>{e}<br></br></>})} <br></br>
                    
                </Accordion.Body>
            </Accordion.Item>
        </>
    )
}

function RigaCorsoEditable(props){
    return(
        <>
            <Accordion.Item eventKey={props.idx}  >
                <Row>
                    <Col xs={11}>
                        <Accordion.Header> 
                            <div className="d-flex w-100 justify-content-between">
                                <span className="col-2" style={!props.bol ? {color:'grey'} : {}}>{props.nome}</span>  
                                <span className="col-2" style={!props.bol ? {color:'grey'} : {}}>{props.codice }</span>  
                                <span className="col-2" style={!props.bol ? {color:'grey'} : {}}>{props.crediti}</span>  
                                <span className="col-2" style={!props.bol ? {color:'grey'} : {}}>{props.nstudenti}</span>  
                                <span className="col-2" style={!props.bol ? {color:'grey'} : {}}>{props.maxstudenti}</span> 
                                
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            
                            Materie propedeutiche:<br></br> {props.propedeutica} <br></br>
                            Materie incompatibili:<br></br> {props.inc.inc.map(e => {return <>{e}<br></br></>})} <br></br>
                    
                            
                        </Accordion.Body>
                    </Col>
                    <Col xs={1}>
                        <span > 
                            {props.bol ? ( props.type==0 ?
                            <Button size= '' className='rounded-circle pt-2  mt-2' variant='outline-dark' onClick={() => {props.add({id: props.id, nome: props.nome, codice: props.codice, crediti: props.crediti,nstudenti: props.nstudenti,maxstudenti: props.maxstudenti, propedeutica: props.propedeutica, inc: props.inc.inc}) }}>
                                <i className="bi bi-file-earmark-plus"></i>
                            </Button> : ( props.type== 2 ? <Incompatibile /> : ( props.type==3 ? <Full/> : <Propedeutico/> ))) : <Inserito />
                            }
                        </span>
                    </Col>
                </Row>
            </Accordion.Item>
        </>
    )
}

/******************************************************************************************/
/******************************* COMPONENTI INFORMATIVI  **********************************/

function Inserito(props) {
    return(
        <>
            <div className='pt-2'>
                <h3><i size='lg' style={{color: 'blueviolet' , fontWeight: 'bold'}} className="bi bi-check-circle"></i></h3>
            </div>
        </>
    )
}

function Incompatibile(props){

    return(
        <>
        <OverlayTrigger
            key='right'
            placement='right'
            overlay={
            <Tooltip id={`tooltip-right`}>
                <strong>Materia incompatibile con il piano di studi</strong>.
            </Tooltip>
            }
            >
            <div className='pt-2'>
                <h3><i size='lg' style={{color: 'red' , fontWeight: 'bold'}} className="bi bi-exclamation-circle"></i></h3>
            </div>
            </OverlayTrigger>
            <p style={{color: 'red' , fontWeight: 'bold'}}>inc</p>
        </>
    )
}

function Propedeutico(props){

    return(
        <>  
        <OverlayTrigger
            key='right'
            placement='right'
            overlay={
            <Tooltip id={`tooltip-right`}>
                <strong>Propedeuticità non rispettata</strong>.
            </Tooltip>
            }
            >
            <div className='pt-2'>
                <h3><i size='lg' style={{color: 'deepskyblue' , fontWeight: 'bold'}} className="bi bi-info-circle"></i></h3>
            </div>
            </OverlayTrigger>
            <p style={{color: 'deepskyblue' , fontWeight: 'bold'}}>prop</p>
        </>
    )
}

function Full(props){

    return(
        <>
            <OverlayTrigger
            key='right'
            placement='right'
            overlay={
            <Tooltip id={`tooltip-right`}>
                <strong>Raggiunto il massimo di studenti</strong>.
            </Tooltip>
            }
            >
            <div className='pt-2'>
                <h3><i size='lg' style={{color: 'goldenrod' , fontWeight: 'bold'}} className="bi bi-dash-circle"></i></h3>
            </div>
        </OverlayTrigger>
        <p style={{color: 'goldenrod' , fontWeight: 'bold'}}>full</p>
        </>
    )
}

/******************************************************************************************/

export {ListaCorsi, ListaCorsiEditable , RigaCorso}; 