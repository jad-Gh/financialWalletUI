import { Sidebar,Menu,SubMenu,MenuItem,useProSidebar } from "react-pro-sidebar";
import { Link, Route, Routes } from "react-router-dom";
import Categories from "../Pages/Categories";
import Conversions from "../Pages/Conversions";
import Dashboard from "../Pages/Dashboard";
import Transactions from "../Pages/Transactions";
import TopNav from "./TopNav";

const NavigationRouter = ()=>{

    const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar();


    return (
        <>
            <TopNav collapseSidebar={toggleSidebar}/>

            <Sidebar breakPoint="always">
                <Menu>
                    <MenuItem component={<Link to="/v1/dashboard" />}> 
                        Dashboard
                    </MenuItem>
                    <MenuItem component={<Link to="/v1/categories" />}> 
                        Categories
                    </MenuItem>
                    <MenuItem component={<Link to="/v1/conversions" />}> 
                        Conversions
                    </MenuItem>
                    <MenuItem component={<Link to="/v1/transactions" />}> 
                        Transations
                    </MenuItem>
                </Menu>
            </Sidebar>

            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/conversions" element={<Conversions/>}/>
                <Route path="/transactions" element={<Transactions/>}/>
            </Routes>
                
        </>
    )
}

export default NavigationRouter;