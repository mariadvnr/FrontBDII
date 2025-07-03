import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Pagprincipal from './views/PagPrincipal';
import RoutesPage from './views/RoutesPage';
import SimulationPage from './views/SimulationPage';
import './App.css'


function App() {
    return(
    <Router>
        <Routes>
            <Route path="/" element={<Pagprincipal/>} />
            <Route path="/calcularuta" element={<RoutesPage/>} />
            <Route path="/simulartrafico" element={<SimulationPage/>} />
        </Routes>
    </Router>
    )

}

export default App
