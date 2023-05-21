import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Offcanvas, Row } from "react-bootstrap"
import DatePicker from "react-datepicker";
import Select from "react-select";
import { CONFIG, GET_CATGORIES, GET_TRANSACTIONS } from "../API";
import axios from "axios";
import { errorHandler, get_YYYY_MM_DD } from "../UTILS/functions";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const Dashboard = ()=>{

    const [state,setState]= useState({
        loading:false,
        showFilterBy:false,
        categoryToFilter:null,
        fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
        toDate:new Date(),
        quickFilter:"This Month",
        period:"DAY",
        categoryList:[],

        totalTransactions:0,
        totalVolume:0,
        transactionVolumeByDate:[],
        transactionVolumeByCategory:[],

    });

    useEffect(()=>{
        getCategories();
        getTransactionKPIs();
        getTransactionCharts();
        getTransactionChartsByCategory();
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
                period:"YEAR",
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

    const getTransactionCharts = ()=>{
        let url = new URL(`${GET_TRANSACTIONS}/charts`)

        url.searchParams.append("startDate",get_YYYY_MM_DD(state.fromDate));
        url.searchParams.append("endDate",get_YYYY_MM_DD(state.toDate));
        url.searchParams.append("periodical",state.period);
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
                        transactionVolumeByDate:res?.data?.data?.data,
                    };
                }
            );

        })
        .catch((err)=>{
            errorHandler(err) 
        })
    }

    const getTransactionChartsByCategory = ()=>{
        let url = new URL(`${GET_TRANSACTIONS}/charts-by-category`)

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
                        transactionVolumeByCategory:res?.data?.data?.data,
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

                                <Col md="12" className="my-2">
                                    <Form.Label className="main-filter-label">Quick Filter</Form.Label>
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

                                <Col md="12" className="my-2">
                                    <Form.Label className="secondary-filter-label">Period</Form.Label>
                                    <br />
                                    <Button 
                                    variant={state.period==="DAY" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                period:"DAY"
                                            };
                                        });
                                    }}
                                    >
                                        Day
                                    </Button>
                                    <Button 
                                    variant={state.period==="MONTH" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                period:"MONTH"
                                            };
                                        });
                                    }}
                                    >
                                     Month
                                    </Button>
                                    <Button 
                                    variant={state.period==="YEAR" ? "secondary": "outline-secondary"} 
                                    size="sm"
                                    className="m-1"
                                    onClick={()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                period:"YEAR"
                                            };
                                        });
                                    }}
                                    >
                                        Year
                                    </Button>
                                    
                                </Col>

                                <Col md="12" className="my-2">

                                    <Form.Label className="secondary-filter-label">Category</Form.Label>
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

                                    <Form.Label className="secondary-filter-label">From Date</Form.Label>
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

                                    <Form.Label className="secondary-filter-label" >To Date</Form.Label>
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
                                                getTransactionCharts();
                                                getTransactionChartsByCategory();
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
                                    <HighchartsReact
                                    highcharts={Highcharts}
                                    options={{
                                        chart: {
                                            type: 'column'
                                        },
                                        title: {
                                            text: 'Transaction Volume by Date'
                                        },
                                       
                                        xAxis: {
                                            categories: state.transactionVolumeByDate.map((item)=>{return item?.date}),
                                            crosshair: true
                                        },
                                        yAxis: [{
                                            title: {
                                                text: "Volume"
                                            },
                                            
                                        },{
                                            title: {
                                                text: "Transactions",
                                            },
                                            opposite:true,
                                            labels: {
                                                format: '{value}',
                                                // Add the following line to display only full numbers without decimals
                                                precision: 0
                                              }
                                        }],
                                        tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                        },
                                        plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                        },
                                        series: [{
                                            name: 'Volume',
                                            data: state.transactionVolumeByDate.map((item)=>{return item?.totalVolume}),
                                            yAxis:0,
                                    
                                        }, {
                                            name: 'Transactions',
                                            data: state.transactionVolumeByDate.map((item)=>{return item?.transactionCount}),
                                            yAxis:1,
                                        }]
                                    }}
                                    />
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
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={{
                                        chart: {
                                            type: 'column'
                                        },
                                        title: {
                                            text: 'Transaction Volume by Category'
                                        },
                                       
                                        xAxis: {
                                            categories: state.transactionVolumeByCategory.map((item)=>{return item?.categoryName}),
                                            crosshair: true
                                        },
                                        yAxis: [{
                                            title: {
                                                text: "Volume"
                                            },
                                            
                                        },{
                                            title: {
                                                text: "Transactions",
                                            },
                                            opposite:true,
                                            labels: {
                                                format: '{value}',
                                                // Add the following line to display only full numbers without decimals
                                                precision: 0
                                              }
                                        }],
                                        tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                        },
                                        plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                        },
                                        series: [{
                                            name: 'Volume',
                                            data: state.transactionVolumeByCategory.map((item)=>{return item?.totalVolume}),
                                            yAxis:0,
                                    
                                        }, {
                                            name: 'Transactions',
                                            data: state.transactionVolumeByCategory.map((item)=>{return item?.transactionCount}),
                                            yAxis:1,
                                        }]
                                    }}
                                    />
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