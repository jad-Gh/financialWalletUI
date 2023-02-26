import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import TopNav from "./TopNav";

const NavigationRouter = ()=>{
    return (
        <>
            <TopNav/>
            hello from nav Router
            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/categories" element={<>Caregories</>}/>
            </Routes>
                
        </>
    )
}

export default NavigationRouter;