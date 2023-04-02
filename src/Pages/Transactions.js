

import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { CONFIG, GET_CATGORIES, GET_TRANSACTIONS } from "../API";
import axios from "axios";
import { errorHandler } from "../UTILS/functions";
import { toast } from "react-toastify";
import Select from "react-select";


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

        

    })

    useEffect(()=>{
        getCategories();
    },[])

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

    const toggleEditModal = (id,name,expense)=>{
        setState(prevState => {
            return {...prevState,
               editModal: !state.editModal,
               itemToEdit:id,
               categoryName:name,
               expense:expense
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

    const addTransaction = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_TRANSACTIONS)
        let body = {
            amount:state.amount,
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

        let url = new URL(GET_CATGORIES)
        let body = {
            name:state.categoryName,
            expense:state.expense,
            id:state.itemToEdit
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.put(url,body,CONFIG)
        .then((res)=>{
            toast.success("Category Updated successfully !");
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
                        <MaterialTable
                            key={state.tableKey}
                            columns={[
                                { title: 'Category', field: 'category' },
                                { title: 'Amount', field: 'amount' },
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

                                    CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

                                    axios.get(url,CONFIG)
                                    .then((res)=>{
                                      resolve({
                                        data: res?.data?.data?.data.map((item)=>{
                                            return {
                                                ...item,
                                                category:item?.finCategory?.name,
                                                amount:
                                                <span 
                                                className={item?.finCategory?.expense ? "text-danger" : "text-success"}>
                                                    <b>{item?.amount}</b>
                                                </span>
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
                                         toggleEditModal(rowData?.id,rowData?.name,rowData?.expense)
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