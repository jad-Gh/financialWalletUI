import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { CONFIG, GET_CATGORIES } from "../API";
import axios from "axios";
import { errorHandler, formatDate } from "../UTILS/functions";
import { toast } from "react-toastify";


const Categories = ()=>{

    const [state,setState]= useState({
        loading:false,
        tableData:[],
        search:"",
        resetPagination:false,
        tableKey:Math.random(),

        addModal:false,
        categoryName:"",
        expense:false,

        deleteModal:false,
        itemToDelete:null,
        itemToDeleteName:null,

        editModal:false,
        itemToEdit:null,
    })

    useEffect(()=>{

    },[])

    const toggleAddModal = ()=>{
        setState(prevState => {
            return {...prevState,
               addModal: !state.addModal,
               categoryName:"",
               expense:false,
            };
        });
    }

    const toggleDeleteModal = (id,name)=>{
        setState(prevState => {
            return {...prevState,
               deleteModal: !state.deleteModal,
               itemToDelete:id,
               itemToDeleteName:name,
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

    const addCategory = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_CATGORIES)
        let body = {
            name:state.categoryName,
            expense:state.expense,
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.post(url,body,CONFIG)
        .then((res)=>{
            toast.success("Category added successfully !");
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

    const deleteCategory = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(`${GET_CATGORIES}/${state.itemToDelete}`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.delete(url,CONFIG)
        .then((res)=>{
            toast.success(`Category ${state.itemToDeleteName} deleted successfully !`);
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

    const editCategory=()=>{
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
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    id="search"
                                    name="search"
                                    maxLength={"50"}
                                    value={state.search}
                                    onChange={(e)=>{
                                        setState(prevState => {
                                            return {...prevState,
                                                search:e.target.value,
                                                resetPagination:true,
                                                tableKey:Math.random(),
                                            };
                                        });
                                    }}
                                    className="m-1"
                                />
                            </Col>
                            <Col md="8" className="d-flex justify-content-end">
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
                                { title: 'Name', field: 'name' },
                                { title: 'Expense', field: 'expense' },
                                { title: 'Creation Date', field: 'createdAt' },
                                
                            ]}
                            data={query =>
                                new Promise((resolve, reject) => {
                                    setState(prevState => {
                                        return {...prevState,
                                            loading:true,};
                                    });

                                    let url = new URL(GET_CATGORIES)
                                    url.searchParams.append("page",state?.resetPagination ? 0 : query.page);
                                    url.searchParams.append("size",query.pageSize);
                                    url.searchParams.append("search",state.search);

                                    CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

                                    axios.get(url,CONFIG)
                                    .then((res)=>{
                                      resolve({
                                        data: res?.data?.data?.data.map((item)=>{
                                            return {
                                                ...item,
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
                                         toggleEditModal(rowData?.id,rowData?.name,rowData?.expense)
                                    }
                                },
                                {
                                    icon: "delete" ,
                                    tooltip: 'Delete',
                                    onClick: (event, rowData) => {
                                         toggleDeleteModal(rowData?.id,rowData?.name)
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
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">
                        
                        <Form.Label htmlFor="categoryName">Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="categoryName"
                            value={state.categoryName}
                            placeholder="Enter name"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        categoryName:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Check 
                            type={"checkbox"}
                            id={`default-checkbox1`}
                            label={`Expense ? `}
                            className="my-3"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        expense:e.target.checked,
                                    };
                                });
                            }}
                        />
                        
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleAddModal}>Close</Button>
                    <Button variant="primary" onClick={addCategory} disabled={state.loading}>Save</Button>
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.editModal}
            onHide={toggleEditModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">
                        
                        <Form.Label htmlFor="categoryName">Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="categoryName"
                            value={state.categoryName}
                            placeholder="Enter name"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        categoryName:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Check 
                            type={"checkbox"}
                            id={`default-checkbox1`}
                            label={`Expense ? `}
                            checked={state.expense}
                            className="my-3"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        expense:e.target.checked,
                                    };
                                });
                            }}
                        />
                        
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleEditModal}>Close</Button>
                    <Button variant="primary" onClick={editCategory} disabled={state.loading}>Edit</Button>
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.deleteModal}
            onHide={toggleDeleteModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">    
                        <p>Are you sure you want to delete the <b>{state.itemToDeleteName}</b> Category ?</p>    
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleDeleteModal}>Close</Button>
                    <Button variant="danger" onClick={deleteCategory} disabled={state.loading}>Delete</Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default Categories