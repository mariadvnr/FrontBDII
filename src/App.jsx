import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Pagprincipal from './views/PagPrincipal';
import './App.css'


function App() {
    return(
    <Router>
        <Routes>
                <Route path="/" element={<Pagprincipal/>} />
        </Routes>
            
    </Router>
    )

}

export default App
