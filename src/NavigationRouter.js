import { Route, Routes } from "react-router-dom";

const NavigationRouter = ()=>{
    return (
        <>
            hello from nav Router
            <Routes>
            <Route path="/nav1" element={<>nav router 1</>}/>
                
            <Route path="/nav2" element={<>nav router 2</>}/>
            </Routes>
                
        </>
    )
}

export default NavigationRouter;