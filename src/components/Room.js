import {Link} from 'react-router-dom'
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { FaPersonBooth } from 'react-icons/fa';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// AOS.init({duration:1000});
function Room({ room , fromdate , todate }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className='row mt-2 box-shadow pad-20'>
            <div className='col-md-5'>
                <img src={room.imageurls[0]} className='smallimg' alt='#' />
            </div>
            <div className='col-md-7 '>
                <h1>{room.name}</h1>
                <h5>{room.location}</h5>
                <h6>{room.facilities}</h6>
                <h6><BsFillBookmarkStarFill className={room.rating > 3 ? "green" : "red"}/>{` ${room.rating} ratings`}</h6>
                <h6>{`Max Count: `}<FaPersonBooth style={{color:"red"}}/>{`  ${room.maxcount} persons`}</h6>
                    <h6>Phone Number:{room.phonenumber}</h6>
                    <h6>Type:{room.type}</h6>
                
                <div style={{ float: 'right' }}>

                    
                   <button className='btn-view ' onClick={handleShow}>View Details</button>

                   {(fromdate && todate) && (
                         <Link to={`/book/${room._id}/${fromdate}/${todate}`}><button className='btn-book'>Book Now</button></Link> 
                    )}
                </div>
            </div>


            { /*modal area */}
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header >
                    <Modal.Title >{room.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>

                        {room.imageurls.map((ele)=>{
                            return(<Carousel.Item>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={ele}
                                    alt="#"
                                /></Carousel.Item>)
                        })}

                        
                    </Carousel>
                    <p style={{fontSize:"20px",color:"black"}}>{room.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Room
