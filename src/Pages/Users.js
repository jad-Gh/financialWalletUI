import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { CONFIG, GET_CATGORIES, GET_USER } from "../API";
import axios from "axios";
import { errorHandler, formatDate } from "../UTILS/functions";
import { toast } from "react-toastify";


const Users = ()=>{

    const [state,setState]= useState({
        loading:false,
        tableData:[],
        search:"",
        resetPagination:false,
        tableKey:Math.random(),

        addModal:false,
        fullName:"",
        email:"",
        active:true,
        password:"",
        confirmPassword:"",

        deleteModal:false,
        itemToDelete:null,
        itemToDeleteName:null,

        editModal:false,
        itemToEdit:null,
    })


    const toggleAddModal = ()=>{
        setState(prevState => {
            return {...prevState,
               addModal: !state.addModal,
               fullName:"",
               email:"",
               active:true,
               password:"",
               confirmPassword:"",
            };
        });
    }

    const toggleDeleteModal = (data)=>{
        setState(prevState => {
            return {...prevState,
               deleteModal: !state.deleteModal,
               itemToDelete:data?.id,
               itemToDeleteName:data?.fullName,
            };
        });
    }

    const toggleEditModal = (data)=>{
        setState(prevState => {
            return {...prevState,
               editModal: !state.editModal,
               itemToEdit:data?.id,
               fullName:data?.fullName,
               email:data?.email,
               active:data?.active,
               password:"",
               confirmPassword:"",
            };
        });
    }

    const addUser = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_USER)
        let body = {
            email:state.email,
            password:state.password,
            fullName:state.fullName,
            active:state.active
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.post(url,body,CONFIG)
        .then((res)=>{
            toast.success("User added successfully !");
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

    const deleteUser = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(`${GET_USER}/${state.itemToDelete}`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.delete(url,CONFIG)
        .then((res)=>{
            toast.success(`User ${state.itemToDeleteName} deleted successfully !`);
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

    const editUser=()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_USER)
        let body = {
            email:state.email,
            fullName:state.fullName,
            active:state.active,
            id:state.itemToEdit
        }

        if (state.password) body["password"] = state?.password;

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.put(url,body,CONFIG)
        .then((res)=>{
            toast.success("User Updated successfully !");
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
                                { title: 'Fullname', field: 'fullName' },
                                { title: 'Email', field: 'email' },
                                { title: 'Status', field: 'status' },
                                { title: 'Role', field: 'roleName' },
                                { title: 'Creation Date', field: 'createdAt' },
                                
                            ]}
                            data={query =>
                                new Promise((resolve, reject) => {
                                    setState(prevState => {
                                        return {...prevState,
                                            loading:true,};
                                    });

                                    let url = new URL(GET_USER)
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
                                                status:item?.active ? "Active" : "Inactive",
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
                                         toggleDeleteModal(rowData)
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
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">
                        
                        <Form.Label htmlFor="fullName">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="fullName"
                            value={state.fullName}
                            placeholder="Enter fullname"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        fullName:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                            type="text"
                            id="email"
                            value={state.email}
                            placeholder="Enter email"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        email:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="password"
                            value={state.password}
                            placeholder="Enter password"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        password:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="confirmPassword"
                            value={state.confirmPassword}
                            placeholder="Confirm password"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        confirmPassword:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Check 
                            type={"checkbox"}
                            id={`default-checkbox1`}
                            label={`Active ? `}
                            className="my-3"
                            checked={state?.active}
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        active:e.target.checked,
                                    };
                                });
                            }}
                        />
                        
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleAddModal}>Close</Button>
                    <Button 
                    variant="primary" 
                    onClick={addUser} 
                    disabled={state.loading 
                        || !state.fullName
                        || !state.email
                        || !state.password
                        || state.password!==state.confirmPassword}
                    >Save</Button>
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.editModal}
            onHide={toggleEditModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">
                        
                    <Form.Label htmlFor="fullName">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="fullName"
                            value={state.fullName}
                            placeholder="Enter fullname"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        fullName:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                            type="text"
                            id="email"
                            value={state.email}
                            placeholder="Enter email"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        email:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="password"
                            value={state.password}
                            placeholder="Enter password"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        password:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="confirmPassword"
                            value={state.confirmPassword}
                            placeholder="Confirm password"
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        confirmPassword:e.target.value,
                                    };
                                });
                            }}
                        />

                        <Form.Check 
                            type={"checkbox"}
                            id={`default-checkbox1`}
                            label={`Active ? `}
                            className="my-3"
                            checked={state?.active}
                            onChange={(e)=>{
                                setState(prevState => {
                                    return {...prevState,
                                        active:e.target.checked,
                                    };
                                });
                            }}
                        />
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleEditModal}>Close</Button>
                    <Button 
                    variant="primary" 
                    onClick={editUser} 
                    disabled={
                        state.loading
                        || !state.fullName
                        || !state.email
                        || state.password!==state.confirmPassword
                    }
                    >Edit</Button>
                </Modal.Footer>
            </Modal>

            <Modal 
            centered 
            show={state.deleteModal}
            onHide={toggleDeleteModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col md="12">    
                        <p>Are you sure you want to delete the <b>{state.itemToDeleteName}</b> User ?</p>    
                    </Col>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleDeleteModal}>Close</Button>
                    <Button variant="danger" onClick={deleteUser} disabled={state.loading}>Delete</Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default Users