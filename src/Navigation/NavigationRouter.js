import { Sidebar,Menu,SubMenu,MenuItem,useProSidebar } from "react-pro-sidebar";
import { Link, Route, Routes } from "react-router-dom";
import Categories from "../Pages/Categories";
import Conversions from "../Pages/Conversions";
import Dashboard from "../Pages/Dashboard";
import Transactions from "../Pages/Transactions";
import TopNav from "./TopNav";
import FinAsset from "../Pages/FinAssets";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CONFIG, GET_USER } from "../API";
import axios from "axios";
import { errorHandler } from "../UTILS/functions";
import CategoryIcon from '@material-ui/icons/CategoryRounded';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import Money from '@material-ui/icons/Payment';
import Gold from '@material-ui/icons/House';
import UserIcon from '@material-ui/icons/Person';
import ChatIcon from "@material-ui/icons/Forum";
import Users from "../Pages/Users";
import ChatRoom from "../Pages/ChatRoom";

const NavigationRouter = ()=>{

    const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar();
    const [user,setUser] = useState({});

    useEffect(()=>{
        getUserInfo();
    },[])

    const getUserInfo = ()=>{
        let url = new URL(GET_USER + "/info")

        CONFIG.headers.Authorization = "Bearer " + localStorage.getItem("token") 

        axios.get(url,CONFIG)
        .then((res)=>{
           setUser(res?.data?.data?.User)
        })
        .catch((err)=>{
            errorHandler(err) 
        })
    }


    return (
        <>
            <TopNav collapseSidebar={toggleSidebar}/>

            <Sidebar breakPoint="always" backgroundColor="#fff">
                <Menu
                  menuItemStyles={{
                    button: ({ level, active, disabled }) => {
                      // only apply styles on first level elements of the tree
                      if (level === 0)
                        return {
                          color: disabled ? '#f5d9ff' : '#191F6C',
                          backgroundColor: active ? '#191F6C50' : undefined,
                        };
                    },
                  }}
                >
                    <Col md="12" className="d-flex justify-content-center align-items-center my-2">
                        <div className="image-container">

                        </div>
                    </Col>
                    <Col md="12" className="d-flex justify-content-center align-items-center my-2">
                        <h4>Welcome</h4>
                    </Col>
                    <Col md="12" className="d-flex justify-content-center align-items-center my-2">
                        <h5>{user?.fullName}</h5>
                    </Col>
                    <MenuItem 
                    active={window.location.pathname.includes("dashboard")} 
                    icon={<DashboardIcon/>}
                    component={
                    <Link to="/v1/dashboard" onClick={()=>{toggleSidebar(false)}}/>
                    }> 
                        Dashboard
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("categories")} 
                    icon={<CategoryIcon/>}
                    component={<Link to="/v1/categories" onClick={()=>{toggleSidebar(false)}}/>}
                    > 
                        Categories
                    </MenuItem>
                    {/* <MenuItem 
                    active={window.location.pathname.includes("conversions")} 
                    component={<Link to="/v1/conversions" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Conversions
                    </MenuItem> */}
                    <MenuItem 
                    active={window.location.pathname.includes("transactions")} 
                    icon={<Money/>}
                    component={<Link to="/v1/transactions" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Transactions
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("fin-assets")} 
                    icon={<Gold/>}
                    component={<Link to="/v1/fin-assets" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Financial Assets
                    </MenuItem>
                    {user?.roleName==="ROLE_ADMIN" && <MenuItem 
                    active={window.location.pathname.includes("users")} 
                    icon={<UserIcon/>}
                    component={<Link to="/v1/users" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Users
                    </MenuItem>}
                    <MenuItem 
                    active={window.location.pathname.includes("chat-room")} 
                    icon={<ChatIcon/>}
                    component={<Link to="/v1/chat-room" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Chat Room
                    </MenuItem>
                </Menu>
            </Sidebar>

            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/categories" element={<Categories/>}/>
                {/* <Route path="/conversions" element={<Conversions/>}/> */}
                <Route path="/transactions" element={<Transactions/>}/>
                <Route path="/fin-assets" element={<FinAsset/>}/>
                <Route path="/chat-room" element={<ChatRoom/>}/>
                {user?.roleName==="ROLE_ADMIN" && <Route path="/users" element={<Users/>}/>}
            </Routes>
                
        </>
    )
}

export default NavigationRouter;