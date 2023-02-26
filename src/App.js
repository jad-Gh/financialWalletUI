import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationRouter from './NavigationRouter';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
				<Routes>
					<Route path='/' element={<>hi login</>}/>
					<Route path="/nav/*" element={<NavigationRouter/>} exact />
					
				</Routes>
			</BrowserRouter>
    </div>
  );
}

export default App;
