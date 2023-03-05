import { Sidebar,Menu,SubMenu,MenuItem,useProSidebar } from "react-pro-sidebar";
import { Link, Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import TopNav from "./TopNav";

const NavigationRouter = ()=>{

    const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar();


    return (
        <>
            <TopNav collapseSidebar={collapseSidebar}/>

            <Sidebar breakPoint="sm">
                <Menu>
                    <SubMenu label="Charts">
                        <MenuItem> Pie charts </MenuItem>
                        <MenuItem> Line charts </MenuItem>
                    </SubMenu>
                    <MenuItem > <Link to={"/v1/categories"}>Categories</Link> </MenuItem>
                    <MenuItem> Calendar </MenuItem>
                </Menu>
            </Sidebar>

            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/categories" element={<>Caregories</>}/>
            </Routes>
                
        </>
    )
}

export default NavigationRouter;