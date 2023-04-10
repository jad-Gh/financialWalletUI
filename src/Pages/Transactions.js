

import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row,Offcanvas } from "react-bootstrap";
import { CONFIG, GET_CATGORIES, GET_TRANSACTIONS } from "../API";
import axios from "axios";
import { errorHandler, formatDate, get_YYYY_MM_DD } from "../UTILS/functions";
import { toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";


const Transactions = ()=>{

    const [state,setState]= useState({
        loading:false,
        tableData:[],
        search:"",
        resetPagination:false,
        tableKey:Math.random(),

        addModal:false,
        categoryList:[],
        selectedCategory:null,
        amount:"",
        description:"",

        deleteModal:false,
        itemToDelete:null,

        editModal:false,
        itemToEdit:null,

        totalTransactions:0,
        totalVolume:0,

        showFilterBy:false,
        categoryToFilter:null,
        fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
        toDate:new Date(),
        selectedSortBy:{label:"Creation Date Ascending",value:1},
        sortByList:[
            {label:"Creation Date Ascending",value:1},
            {label:"Creation Date Descending",value:2},
            {label:"Amount Ascending ",value:3},
            {label:"Amount Descending",value:4},
        ],

        quickFilter:"This Month",

    })

    useEffect(()=>{
        getCategories();
    },[])

    useEffect(()=>{
        getTransactionKPIs();
    },[state.tableKey])

    const toggleAddModal = ()=>{
        setState(prevState => {
            return {...prevState,
               addModal: !state.addModal,
               selectedCategory:null,
               amount:"",
               description:"",
            };
        });
    }

    const toggleDeleteModal = (id)=>{
        setState(prevState => {
            return {...prevState,
               deleteModal: !state.deleteModal,
               itemToDelete:id,
            };
        });
    }

    const toggleEditModal = (data)=>{
        setState(prevState => {
            return {...prevState,
               editModal: !state.editModal,
               itemToEdit:data?.id,
               description:data?.description,
               amount:Math.abs(data?.amount),
               selectedCategory:{label:data?.finCategory?.name,value:data?.finCategory?.id}
            };
        });
    }

    const toggleFilterby = ()=>{
        setState(prevState => {
            return {...prevState,
               showFilterBy: !state.showFilterBy,
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

    const addTransaction = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_TRANSACTIONS)
        let body = {
            amount:Number(state.amount),
            description:state.description,
            finCategory:{id: state?.selectedCategory?.value}
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.post(url,body,CONFIG)
        .then((res)=>{
            toast.success("Transaction added successfully !");
            toggleAddModal();
            setState(prevState => {
                return {...prevState,
                    tableKey:Math.random(),
                };
            });

        }).catch((err)=>{
            errorHandler(err);
            setState(prevState => {return {...prevState,loading:false,};});
        })
    }

    const deleteTransaction = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(`${GET_TRANSACTIONS}/${state.itemToDelete}`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.delete(url,CONFIG)
        .then((res)=>{
            toast.success(`Transaction deleted successfully !`);
            toggleDeleteModal();
            setState(prevState => {
                return {...prevState,
                    tableKey:Math.random(),
                };
            });

        }).catch((err)=>{
            errorHandler(err);
            setState(prevState => {return {...prevState,loading:false,};});
        })
    }

    const editTransaction=()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_TRANSACTIONS)
        let body = {
            id:state.itemToEdit,
            description:state.description,
            amount:state.amount,
            finCategory:{id:state?.selectedCategory?.value}

        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.put(url,body,CONFIG)
        .then((res)=>{
            toast.success("Transaction Updated successfully !");
            toggleEditModal();
            setState(prevState => {
                return {...prevState,
                    tableKey:Math.random(),
                };
            });

        }).catch((err)=>{
            errorHandler(err);
            setState(prevState => {return {...prevState,loading:false,};});
        })
    }

    const clearFilters = ()=>{
        setState(prevState => {
            return {...prevState,
                categoryToFilter:null,
                fromDate:new Date(new Date().getFullYear(),new Date().getMonth(),1),
                toDate:new Date(),
                selectedSortBy:{label:"Creation Date Ascending",value:1},
                tableKey:Math.random(),
            };
        });
    }

    return(
        <div>
            <Container>
                <Card className="rounded-container-card">
                    <Card.Body>
                        <Row className="my-1">
                            <Col md="4" className="d-flex justify-content-start">
                               
                            </Col>
                            <Col md="8" className="d-flex justify-content-end">
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
                                <Button 
                                className="add-btn m-1"
                                disabled={state.loading}
                                onClick={()=>{
                                    toggleAddModal();
                                }}
                                >
                                    + Add
                                </Button> 
                            </Col>
                        </Row>

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

                                    <Form.Label>Sort By</Form.Label>
                                    <Select
                                    options={state.sortByList}
                                    isClearable
                                    value={state.selectedSortBy}
                                    onChange={(e)=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                selectedSortBy:e,
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
                                                setState(prevState => {
                                                    return {...prevState,
                                                        tableKey:Math.random(),
                                                    };
                                                });
                                            }} 
                                            disabled={state.loading}>
                                                Apply
                                            </Button>
                                        
                                    </Col>
                                </Col>
                            </Offcanvas.Body>
                        </Offcanvas>

                        <MaterialTable
                            key={state.tableKey}
                            columns={[
                                { title: 'Category', field: 'category' },
                                { title: 'Amount', field: 'displayAmount' },
                                { title: 'Description', field: 'description' },
                                { title: 'Creation Date', field: 'createdAt' },
                            
                            ]}
                            data={query =>
                                new Promise((resolve, reject) => {
                                    setState(prevState => {
                                        return {...prevState,
                                            loading:true,};
                                    });

                                    let url = new URL(GET_TRANSACTIONS)
                                    url.searchParams.append("page",state?.resetPagination ? 0 : query.page);
                                    url.searchParams.append("size",query.pageSize);
                                    url.searchParams.append("startDate",get_YYYY_MM_DD(state.fromDate));
                                    url.searchParams.append("endDate",get_YYYY_MM_DD(state.toDate));
                                    if (state.categoryToFilter?.value) 
                                    {
                                        url.searchParams.append("categoryId",state.categoryToFilter?.value );
                                    }
                                    url.searchParams.append("orderBy",state?.selectedSortBy?.value ?? null);

                                    CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

                                    axios.get(url,CONFIG)
                                    .then((res)=>{
                                      resolve({
                                        data: res?.data?.data?.data.map((item)=>{
                                            return {
                                                ...item,
                                                category:item?.finCategory?.name,
                                                displayAmount:
                                                <span 
                                                className={item?.finCategory?.expense ? "text-danger" : "text-success"}>
                                                    <b>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            }).format(item?.amount)
                                                        }
                                                    
                                                    </b>
                                                </span>,
                                                createdAt:formatDate(item?.createdAt)
                                            }
                                        }),
                                        page: state.resetPagination ? 0 : res?.data?.data?.page,
                                        totalCount: res?.data?.data?.totalCount,
                                      })
                                    })
                                    .catch((err)=>{
                                        reject({
                                            data: [],
                                            page: 0,
                                            totalCount: 0,
                                          })
                                         errorHandler(err) 
                                    })
                                    .finally(()=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                loading:false,};
                                        });
                                    })

                                })
                              }  
                            isLoading={state.loading}
                            actions={[
                                {
                                    icon: "edit",
                                    tooltip: 'Edit',
                                    onClick: (event, rowData) => {
                                         toggleEditModal(rowData)
                                    }
                                },
                                {
                                    icon: "delete" ,
                                    tooltip: 'Delete',
                                    onClick: (event, rowData) => {
                                         toggleDeleteModal(rowData?.id)
                                    }
                                }
                            ]}
                            options={{
                                search:false,
                                actionsColumnIndex:6,
                                showTitle:false,
                                pageSize:10,
                                // pageSizeOptions:[],
                            }}
                        />
                        <Row className="mt-3 mb-1" >
                            <Col xl="3"></Col>
                            <Col xl="3"></Col>
                            <Col xl="3" className="mt-2 d-flex justify-content-end">
                                <span className="total-container m-1">
                                    <span className="total-title">
                                        Total Transactions
                                    </span>
                                    <span className="total-value">
                                        {state.totalTransactions}
                                    </span>
                                </span>
                            </Col>
                            <Col xl="3" className="mt-2 d-flex justify-content-end">
                                <span className="total-container m-1">
                                    <span className="total-title">
                                        Total Volume
                                    </span>
                                    <span className="total-value">
                                        {state.totalVolume}
                                    </span>
                                </span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Modal 
            centered 
            show={state.addModal}
            onHide={toggleAddModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Transaction</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">
                        
                        <Form.Label htmlFor="categoryName">Category</Form.Label>
                        <Select
                        options={state.categoryList}
                        isClearable
                        value={state.selectedCategory}
                        onChange={(e)=>{
                            setState(prevState => {
                                return {...prevState,
                                    selectedCategory:e,
                                };
                            }); 
                        }}
                        className="mb-2"
                        />

                        <Form.Label htmlFor="amount">Amount in USD</Form.Label>
                        <Form.Control
                            type="text"
                            id="amount"
                            value={state.amount}
                            placeholder="Enter Amount (USD)"
                            onChange={(e)=>{
                                
                                if (/^\d+(\.\d+)?$/.test(e.target.value) || e.target.value==="")
                                setState(prevState => {
                                    return {...prevState,
                                        amount:e.target.value,
                                    };
                                });
                            }}
                            className="mb-2"
                        />

                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            id="description"
                            value={state.description}
                            placeholder="Enter description"
                            onChange={(e)=>{
                                
                                setState(prevState => {
                                    return {...prevState,
                                        description:e.target.value,
                                    };
                                });
                            }}
                            className="max-height-textarea"
                        />    
                        
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleAddModal}>Close</Button>
                    <Button variant="primary" onClick={addTransaction} 
                    disabled={state.loading || !state.amount || !state.selectedCategory}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.editModal}
            onHide={toggleEditModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Transaction</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">

                        <Form.Label htmlFor="categoryName">Category</Form.Label>
                        <Select
                        options={state.categoryList}
                        isClearable
                        value={state.selectedCategory}
                        onChange={(e)=>{
                            setState(prevState => {
                                return {...prevState,
                                    selectedCategory:e,
                                };
                            }); 
                        }}
                        className="mb-2"
                        />

                        <Form.Label htmlFor="amount">Amount in USD</Form.Label>
                        <Form.Control
                            type="text"
                            id="amount"
                            value={state.amount}
                            placeholder="Enter Amount (USD)"
                            onChange={(e)=>{
                                
                                if (/^[0-9]+$/.test(e.target.value) || e.target.value==="")
                                setState(prevState => {
                                    return {...prevState,
                                        amount:e.target.value,
                                    };
                                });
                            }}
                            className="mb-2"
                        />

                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            id="description"
                            value={state.description}
                            placeholder="Enter description"
                            onChange={(e)=>{
                                
                                setState(prevState => {
                                    return {...prevState,
                                        description:e.target.value,
                                    };
                                });
                            }}
                            className="max-height-textarea"
                        />  
                        
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleEditModal}>Close</Button>
                    <Button variant="primary" onClick={editTransaction} 
                    disabled={state.loading || !state.amount || !state.selectedCategory}>
                        Edit
                    </Button>                
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.deleteModal}
            onHide={toggleDeleteModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Transaction</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">    
                        <p>Are you sure you want to delete this Transaction ?</p>    
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleDeleteModal}>Close</Button>
                    <Button variant="danger" onClick={deleteTransaction} disabled={state.loading}>Delete</Button>
                </Modal.Footer>
            </Modal>

            
        </div>
    )
}

export default Transactions