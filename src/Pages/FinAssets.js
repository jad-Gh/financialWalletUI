

import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row,Offcanvas } from "react-bootstrap";
import { CONFIG, GET_ASSETS, GET_FINASSETS } from "../API";
import axios from "axios";
import { errorHandler, formatDate, get_YYYY_MM_DD } from "../UTILS/functions";
import { toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";


const FinAsset = ()=>{

    const [state,setState]= useState({
        loading:false,
        tableData:[],
        search:"",
        resetPagination:false,
        tableKey:Math.random(),

        addModal:false,
        assetList:[],
        selectedAsset:null,
        amount:"",
        description:"",

        deleteModal:false,
        itemToDelete:null,

        editModal:false,
        itemToEdit:null,

        totalTransactions:0,
        totalVolume:0,
        totalProfit:0,

    })

    useEffect(()=>{
        getAssets();
    },[])

    useEffect(()=>{
        getFinAssetsKPIs();
    },[state.tableKey])

    const toggleAddModal = ()=>{
        setState(prevState => {
            return {...prevState,
               addModal: !state.addModal,
               selectedAsset:null,
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
               amount:Math.abs(data?.priceBought),
               selectedAsset:{label:data?.asset?.name,value:data?.asset?.id}
            };
        });
    }

    const getAssets = ()=>{
        let url = new URL(GET_ASSETS)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
            setState(prevState => 
                {
                    return {...prevState,
                        assetList:res?.data?.data?.data?.map((item)=>{
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

    const refreshGold = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});
        let url = new URL(`${GET_ASSETS}/gold-price/1`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
            setState(prevState => 
                {
                    return {...prevState,
                        tableKey:Math.random(),
                    };
                }
            );
        })
        .catch((err)=>{
            errorHandler(err) 
            setState(prevState => {return {...prevState,loading:false,};});
        })
    }

    const getFinAssetsKPIs = ()=>{
        let url = new URL(`${GET_FINASSETS}/kpi`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
            setState(prevState => 
                {
                    return {...prevState,
                        totalTransactions:res?.data?.data?.data?.transactionCount,
                        totalVolume:res?.data?.data?.data?.totalVolumeFormatted,
                        totalProfit:res?.data?.data?.data?.totalProfitFormatted
                    };
                }
            );

        })
        .catch((err)=>{
            errorHandler(err) 
        })
    }

    const addFinAsset = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_FINASSETS)
        let body = {
            priceBought:Number(state.amount),
            description:state.description,
            asset:{id: state?.selectedAsset?.value}
        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.post(url,body,CONFIG)
        .then((res)=>{
            toast.success("Fin Asset added successfully !");
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

    const deleteFinAsset = ()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(`${GET_FINASSETS}/${state.itemToDelete}`)

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.delete(url,CONFIG)
        .then((res)=>{
            toast.success(`Fin Asset deleted successfully !`);
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

    const editFinAsset=()=>{
        setState(prevState => {return {...prevState,loading:true,};});

        let url = new URL(GET_FINASSETS)
        let body = {
            id:state.itemToEdit,
            description:state.description,
            priceBought:state.amount,
            asset:{id:state?.selectedAsset?.value}

        }

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token");

        axios.put(url,body,CONFIG)
        .then((res)=>{
            toast.success("Fin Asset Updated successfully !");
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
                                    refreshGold()
                                }}
                                >
                                    Refresh
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
                                { title: 'Asset', field: 'assetName' },
                                { title: 'Price Bought', field: 'price' },
                                { title: 'Price Current', field: 'priceCurrent' },
                                { title: 'Profit', field: 'profit' },
                                { title: 'Description', field: 'description' },
                                { title: 'Creation Date', field: 'createdAt' },
                            ]}
                            data={query =>
                                new Promise((resolve, reject) => {
                                    setState(prevState => {
                                        return {...prevState,
                                            loading:true,};
                                    });

                                    let url = new URL(GET_FINASSETS)
                                    url.searchParams.append("page",state?.resetPagination ? 0 : query.page);
                                    url.searchParams.append("size",query.pageSize);

                                    CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

                                    axios.get(url,CONFIG)
                                    .then((res)=>{
                                      resolve({
                                        data: res?.data?.data?.data.map((item)=>{
                                            return {
                                                ...item,
                                                assetName:item?.asset?.name,
                                                price:
                                                <span 
                                                // className={item?.finCategory?.expense ? "text-danger" : "text-success"}
                                                >
                                                    <b>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            }).format(item?.priceBought)
                                                        }
                                                    
                                                    </b>
                                                </span>,
                                                priceCurrent:
                                                <span 
                                                >
                                                    <b>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            }).format(item?.asset?.priceCurrent)
                                                        }
                                                    
                                                    </b>
                                                </span>,
                                                 profit:
                                                 <span 
                                                 className={Number(item?.profit) < 0 ? "text-danger" : "text-success"}
                                                 >
                                                     <b>
                                                         {new Intl.NumberFormat('en-US', {
                                                             style: 'currency',
                                                             currency: 'USD',
                                                             }).format(item?.profit)
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
                                        Current Volume
                                    </span>
                                    <span className="total-value">
                                        {state.totalVolume}
                                    </span>
                                </span>
                            </Col>
                            <Col xl="3" className="mt-2 d-flex justify-content-end">
                                <span className="total-container m-1">
                                    <span className="total-title">
                                        Total Profit
                                    </span>
                                    <span className="total-value">
                                        {state.totalProfit}
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
                        options={state.assetList}
                        isClearable
                        value={state.selectedAsset}
                        onChange={(e)=>{
                            setState(prevState => {
                                return {...prevState,
                                    selectedAsset:e,
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
                    <Button variant="primary" onClick={addFinAsset} 
                    disabled={state.loading || !state.amount || !state.selectedAsset}>
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
                        options={state.assetList}
                        isClearable
                        value={state.selectedAsset}
                        onChange={(e)=>{
                            setState(prevState => {
                                return {...prevState,
                                    selectedAsset:e,
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
                    <Button variant="primary" onClick={editFinAsset} 
                    disabled={state.loading || !state.amount || !state.selectedAsset}>
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
                    <Button variant="danger" onClick={deleteFinAsset} disabled={state.loading}>Delete</Button>
                </Modal.Footer>
            </Modal>

            
        </div>
    )
}

export default FinAsset