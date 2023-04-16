import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Offcanvas, Row } from "react-bootstrap"
import DatePicker from "react-datepicker";
import Select from "react-select";
import { CONFIG, GET_CATGORIES, GET_TRANSACTIONS } from "../API";
import axios from "axios";
import { errorHandler, get_YYYY_MM_DD } from "../UTILS/functions";


const Dashboard = ()=>{

    const [state,setState]= useState({
        loading:false,
        showFilterBy:false,
        categoryToFilter:null,
        fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
        toDate:new Date(),
        quickFilter:"This Month",
        categoryList:[],

        totalTransactions:0,
        totalVolume:0,

    });

    useEffect(()=>{
        getCategories();
        getTransactionKPIs();
    },[]);

    const toggleFilterby = ()=>{
        setState(prevState => {
            return {...prevState,
               showFilterBy: !state.showFilterBy,
            };
        });
    }

    const clearFilters = ()=>{
        setState(prevState => {
            return {...prevState,
                categoryToFilter:null,
                fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
                toDate:new Date(),
                quickFilter:"This Month",
            };
        });
    }

    const getCategories = ()=>{
        let url = new URL(GET_CATGORIES)
        url.searchParams.append("page",0);
        url.searchParams.append("size",100);

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
            setState(prevState => 
                {
                    return {...prevState,
                        categoryList:res?.data?.data?.data?.map((item)=>{
                            return {
                                label:item?.name,
                                value:item?.id,
                            }
                        }),
                    };
                }

            );

        })
        .catch((err)=>{
            errorHandler(err) 
        })
    }

    const getTransactionKPIs = ()=>{
        let url = new URL(`${GET_TRANSACTIONS}/kpis`)

        url.searchParams.append("startDate",get_YYYY_MM_DD(state.fromDate));
        url.searchParams.append("endDate",get_YYYY_MM_DD(state.toDate));
        if (state.categoryToFilter?.value) 
        {
            url.searchParams.append("id",state.categoryToFilter?.value );
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
            setState(prevState => 
                {
                    return {...prevState,
                        totalTransactions:res?.data?.data?.data?.transactionCount,
                        totalVolume:res?.data?.data?.data?.totalVolumeFormatted,
                    };
                }
            );

        })
        .catch((err)=>{
            errorHandler(err) 
        })
    }

    return(
        <div>
            <Container>
                <Col md="12">

                    <Offcanvas show={state.showFilterBy} onHide={toggleFilterby} placement="end" className="offcanvas-width" >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Filter By</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>

                                <Col md="12">
                                    <Form.Label>Quick FIlter</Form.Label>
                                    <br />
                                    <Button 
                                    variant={state.quickFilter==="Today" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                fromDate:new Date(),
                                                toDate:new Date(),
                                                quickFilter:"Today"
                                            };
                                        });
                                    }}
                                    >
                                        Today
                                    </Button>
                                    <Button 
                                    variant={state.quickFilter==="This Month" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
                                                toDate:new Date(),
                                                quickFilter:"This Month"
                                            };
                                        });
                                    }}
                                    >
                                        This Month
                                    </Button>
                                    <Button 
                                    variant={state.quickFilter==="This Year" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                fromDate:new Date(new Date().getFullYear(),0,1),
                                                toDate:new Date(),
                                                quickFilter:"This Year"
                                            };
                                        });
                                    }}
                                    >
                                        This Year
                                    </Button>
                                    
                                </Col>

                                <Col md="12">

                                    <Form.Label>Category</Form.Label>
                                    <Select
                                    options={state.categoryList}
                                    isClearable
                                    value={state.categoryToFilter}
                                    onChange={(e)=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                categoryToFilter:e,
                                            };
                                        }); 
                                    }}
                                    className="mb-2"
                                    />

                                    <Form.Label>From Date</Form.Label>
                                    <DatePicker
                                    showIcon
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={state.toDate ?? new Date()}
                                    showMonthDropdown
                                    showYearDropdown
                                    selected={state.fromDate}
                                    onChange={(date) => {
                                        setState(prevState => {
                                            return {...prevState,
                                                fromDate:date,
                                            };
                                        }); 
                                    }}
                                    className="mb-1"
                                    />

                                    <Form.Label>To Date</Form.Label>
                                    <DatePicker
                                    showIcon
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={new Date()}
                                    minDate={state.fromDate}
                                    selected={state.toDate}
                                    showMonthDropdown
                                    showYearDropdown
                                    onChange={(date) => {
                                        setState(prevState => {
                                            return {...prevState,
                                                toDate:date,
                                            };
                                        }); 
                                    }}
                                    />
                                    <Col size="12" className="bottom-filter-row m-3">
                                        
                                            <span className="clear-button" onClick={clearFilters}>Clear All</span>

                                            <Button variant="primary" className="filter-btn" 
                                            onClick={()=>{
                                                getTransactionKPIs();
                                            }} 
                                            disabled={state.loading}>
                                                Apply
                                            </Button>
                                        
                                    </Col>
                                </Col>
                            </Offcanvas.Body>
                        </Offcanvas>
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
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                <Col md="12" className="d-flex justify-content-center kpi-title">
                                        Total Trx.
                                    </Col>
                                    <Col md="12" className="d-flex justify-content-center kpi-value">
                                        {state.totalTransactions}
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    <Col md="12" className="d-flex justify-content-center kpi-title">
                                        Total Volume
                                    </Col>
                                    <Col md="12" className="d-flex justify-content-center kpi-value">
                                        {state.totalVolume}
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md="6" >
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="dashboard-cards m-1">
                                <Card.Body>
                                    Card 1
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="dashboard-cards m-1">
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