import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationRouter from './Navigation/NavigationRouter';
import Login from './Login/Login';


function App() {
  return (
    <div className="App">
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
