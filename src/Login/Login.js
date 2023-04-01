import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CONFIG, LOGIN } from "../API";
// import logo from "../Assets/mdsl_logo.png";
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
const Login = ()=>{ 

    const [state,setState] = useState({
        email:"",
        password:"",
        error:"",
        loading:false,
    });
    const navigate = useNavigate();

    const signIn = ()=>{
        setState(prevState => {
            return {...prevState,
                loading:true,};
        });

        let postData = {
            email:state.email,
            password:state.password
        }

        axios.post(LOGIN,postData,CONFIG)
        .then((res)=>{
            localStorage.setItem("token",res?.data)
            navigate("/v1/dashboard")
        }).catch((err)=>{
        
            if (err?.response?.status===401){
                setState({...state,error:"Invalid Credentials",loading:false,})
            } else {
                setState({...state,error:"Something went Wrong",loading:false,})
            }
            
        })
    }

    return (
        <div className="login">
            <Container >
                <Col>
                    
                    <Row>
                        <Col>
                            <Card className="p-3">
                                <Card.Title>
                                    Login
                                </Card.Title>
                                <Row>
                                    <Col className="">
                                        Enter Your Login Details to Access Your Account 
                                    </Col>
                                </Row>
                                <Row className="dynamic-spacing">
                                    <form onSubmit={(e)=>{
                                        e.preventDefault();
                                        // signIn();
                                        navigate("/v1/dashboard")
                                    }}>
                                    <Row>
                                        <Col className="text-start">
                                            Email
                                        </Col>
                                    </Row>
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Email" 
                                    className="my-2" 
                                    value={state.email}
                                    maxLength={80}
                                    onChange={(e)=>{
                                        setState({...state,email:e.target.value})
                                    }}
                                    />

                                    <Row>
                                        <Col className="text-start mt-2">
                                            Password
                                        </Col>
                                    </Row>
                                    <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    className="my-2 mb-4" 
                                    value={state.password}
                                    maxLength={80}
                                    onChange={(e)=>{
                                        setState({...state,password:e.target.value})
                                    }}
                                    />

                                    <Row>
                                        <Col className="text-danger">
                                            {state.error} 
                                        </Col>
                                    </Row>

                                    <Button 
                                    className="mt-3" 
                                    disabled={!state.email || !state.password  || state.loading}
                                    onClick={()=>{signIn()}}
                                    type="submit"
                                    style={{width:"100%"}}
                                    >
                                        {!state.loading ? "Login" : <HourglassEmptyIcon/>}
                                    </Button>
                                    </form>
                                </Row>   
                                
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Container>
        </div>
    )
}

export default Login;