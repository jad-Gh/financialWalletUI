import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap"


const Dashboard = ()=>{

    const [state,setState]= useState({
        loading:false,
        showFilterBy:false,
    });

    const toggleFilterby = ()=>{
        setState(prevState => {
            return {...prevState,
               showFilterBy: !state.showFilterBy,
            };
        });
    }

    return(
        <div>
            <Container>
                <Col md="12">
                    <Row>
                        <Col md="12" className="d-flex justify-content-end">
                            <Button 
                                className="add-btn m-1"
                                variant="secondary"
                                disabled={state.loading}
                                onClick={()=>{
                                    toggleFilterby();
                                }}
                                >
                                    Filter By
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md="6" >
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="rounded-container-card m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>   
                    </Row>
                
                </Col>
            </Container>
            
        </div>
    )
}

export default Dashboard