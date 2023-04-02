import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationRouter from './Navigation/NavigationRouter';
import Login from './Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";


function App() {
  return (
    <div className="App">
      <ToastContainer/>
        
      <BrowserRouter>
				<Routes>
					<Route path='/' element={<Login/>}/>
					<Route path="/v1/*" element={<NavigationRouter/>} exact />
					
				</Routes>
			</BrowserRouter>
    </div>
  );
}

export default App;
