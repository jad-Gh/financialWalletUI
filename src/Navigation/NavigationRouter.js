import { Sidebar,Menu,SubMenu,MenuItem,useProSidebar } from "react-pro-sidebar";
import { Link, Route, Routes } from "react-router-dom";
import Categories from "../Pages/Categories";
import Conversions from "../Pages/Conversions";
import Dashboard from "../Pages/Dashboard";
import Transactions from "../Pages/Transactions";
import TopNav from "./TopNav";
import FinAsset from "../Pages/FinAssets";

const NavigationRouter = ()=>{

    const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar();


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
                    <MenuItem 
                    active={window.location.pathname.includes("dashboard")} 
                    component={
                    <Link to="/v1/dashboard" onClick={()=>{toggleSidebar(false)}}/>
                    }> 
                        Dashboard
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("categories")} 
                    component={<Link to="/v1/categories" onClick={()=>{toggleSidebar(false)}}/>}
                    > 
                        Categories
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("conversions")} 
                    component={<Link to="/v1/conversions" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Conversions
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("transactions")} 
                    component={<Link to="/v1/transactions" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Transactions
                    </MenuItem>
                    <MenuItem 
                    active={window.location.pathname.includes("fin-assets")} 
                    component={<Link to="/v1/fin-assets" onClick={()=>{toggleSidebar(false)}}/>}> 
                        Financial Assets
                    </MenuItem>
                </Menu>
            </Sidebar>

            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/conversions" element={<Conversions/>}/>
                <Route path="/transactions" element={<Transactions/>}/>
                <Route path="/fin-assets" element={<FinAsset/>}/>
            </Routes>
                
        </>
    )
}

export default NavigationRouter;