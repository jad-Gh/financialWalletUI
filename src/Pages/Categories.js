import { useState } from "react";
import MaterialTable from "material-table";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";


const Categories = ()=>{

    const [state,setState]= useState({
        loading:false,
        tableData:[{name:"Food"}],
        search:"",
    })

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
                                    onChange={()=>{}}
                                    className="m-1"
                                />
                            </Col>
                            <Col md="8" className="d-flex justify-content-end">
                                <Button 
                                className="add-btn m-1"
                                disabled={state.loading}
                                onClick={()=>{}}
                                >
                                    + Add
                                </Button> 
                            </Col>
                        </Row>
                        <MaterialTable
                        columns={[
                            { title: 'Name', field: 'name' },
                            { title: 'Code', field: 'instCode' },
                            { title: 'Status', field: 'enabled' },
                            
                        ]}
                        data={state.tableData}  
                        isLoading={state.tableLoading}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: 'Edit',
                                onClick: (event, rowData) => {
                                    // toggleEditInstitution(false,rowData)
                                }
                            },
                            {
                                icon: "delete" ,
                                tooltip: 'Delete',
                                onClick: (event, rowData) => {
                                    // toggleDeleteModal(rowData)
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
            
        </div>
    )
}

export default Categories