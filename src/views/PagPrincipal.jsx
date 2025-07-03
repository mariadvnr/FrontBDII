import React from "react"
import { useNavigate } from "react-router-dom"
import MockUp from "../assets/Free Food Delivery Man Mockupnew.png"
import "./styles/stylePagPrincipal.css"


const PagPrincipal = () => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/calcularuta');
    }

    return (
        <div className="container">
            <div className="titulo-container">
                <h1>Deli-Very</h1>
            </div>
            <div className="descripcion-container">
                <img src={MockUp} />
                <div className="text-container">
                    <p>¡Bienvenido a <strong>Deli-Very</strong>! Acá podras calcular la duracion del tiempo de tu pedido.</p>
                    <button onClick={handleClick}>Comenzar</button>
                </div>
            </div>
        </div> 
    )
}

export default PagPrincipal