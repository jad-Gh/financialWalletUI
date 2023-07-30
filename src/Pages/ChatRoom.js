import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Arrow from "@material-ui/icons/DoubleArrow";

const ChatRoom = () => {
    const [state,setState] = useState({
        message:"",
        loading:false,
    });

  return (
    <Container className='chat-room'>
        <div>
            Chatroom
        </div>
        <div className='message-box'>
            
                <Form.Control
                    as="textarea"
                    rows={5}
                    id="description"
                    value={state.message}
                    placeholder="Enter message"
                    onChange={(e)=>{
                        setState(prevState => {
                            return {...prevState,
                                message:e.target.value,
                            };
                        });
                    }}
                    className=""
                /> 

                <Button 
                variant="success" 
                className="send-btn" 
                onClick={()=>{
                    
                }} 
                disabled={state.loading}>
                    <Arrow/>
                </Button>
                
                
        </div>
    </Container>
        
  )
}

export default ChatRoom