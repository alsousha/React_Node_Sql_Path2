
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SinglePost from './pages/SinglePost';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './pages/Contacts';
import About from './pages/About';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';

function App() {
  return (
    <div className="App">
				<Header/>
				<div className="main">
					<Routes>
						<Route path='/post/:id' element={<SinglePost />} />
						<Route path='/' element={<MainPage />} />
						<Route path='/newpost' element={<NewPost />} />
						<Route path='/editpost/:id' element={<EditPost />} />
						<Route path='/about' element={<About />} />
						<Route path='/contact' element={<Contacts />} />
					</Routes>				
				</div>
				<Footer/>
		
		
    </div>
  );
}

export default App;
