import axios from "axios";
import { Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';


const TopNav = (props)=>{

    const navigator = useNavigate();

    const logout = ()=>{
        localStorage.clear();
        navigator("/");
    }

    return (
           <Navbar className="mb-2 p-2" sticky="top" >
                
                    <Navbar.Brand className="d-flex align-items-center justify-content-center">
                        {/* <img src={logo} alt="logo" width={"90px"} height={"30px"}/> */}
                        <MenuIcon onClick={()=>{props.collapseSidebar()}}/>
                        <span className="brand-text m-1">Financial Wallet</span>

                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <div className="logout-btn" onClick={logout}>
                            Logout
                        </div>
                    </Navbar.Text>
                    </Navbar.Collapse>
                
            </Navbar>
        
    )
}

export default TopNav;