import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import "./styles/styleRoutesPage.css"


const SimulationPage = () => {
    const navigate = useNavigate()
    const [nodos, setNodos] = useState([]);
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
    const [valor, setValor] = useState(12)
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5001/nodos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la red: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                // Ordenar por nombre
                data.sort((a, b) =>
                    a.properties.nombre.localeCompare(b.properties.nombre)
                );
                setNodos(data);
            })
            .catch(error => {
                console.error('Error al cargar los nodos:', error);
                setError(error.message);
            });
    }, []);
        
    const handleClickCalcular = () => {
        navigate('/calcularuta')
    }

    const manejarCambio = (e) => {
        setValor(e.target.value)
    };

    const handleSimularTrafico = () => {
        if (!startNode || !endNode) {
            alert('Por favor, selecciona un nodo de inicio y de fin.');
            return;
        }

        if (startNode === endNode) {
            alert('El nodo de inicio y fin no pueden ser el mismo.');
            return;
        }

        setResultado(<p>Simulando ruta para las {valor.padStart?.(2, '0') || valor}:00...</p>);

        fetch('http://localhost:5001/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hour: valor,
            start_node: startNode,
            end_node: endNode
        })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                setResultado(<p>Error en la simulación: {data.error}</p>);
                return;
            }

            if (!data.path || data.path.length === 0) {
                setResultado(<p>No se encontró una ruta simulada.</p>);
                return;
            }

            const ruta = (
                <div className="resultados-container">
                    <h2>RUTA SIMULADA PARA LAS {valor.padStart?.(2, '0') || valor}:00</h2>
                    <div>
                        {data.path.map((segmento, index) => {
                            const props = segmento.relationship.properties;
                            const tiempoSimulado = (
                            props.tiempo_minutos *
                            (props.peso_compuesto_simulado / props.peso_compuesto)
                            ).toFixed(2);
                            return (
                            <p key={index}>
                                <b>{segmento.start_node}</b> → <b>{segmento.end_node}</b> (Tiempo Simulado: {tiempoSimulado} minutos con tráfico {props.trafico_actual})
                            </p>
                            );
                        })}
                        <p className="tiempo-total">Tiempo Total: {data.total_cost.toFixed(2)} minutos</p>
                    </div>
                </div>
            );
            setResultado(ruta);
        })
        .catch(error => {
            console.error('Error al simular la ruta:', error);
            setResultado(<p>Ocurrió un error al simular la ruta: {error.message}</p>);
        });
    };

    return (
        <div className="container-routes">
           <div className="header-container">
                <h1>Deli-Very</h1>
                <div>
                    <button onClick={handleClickCalcular}>Calcular Ruta</button>
                </div>
            </div>

            <div className="points-container">
                <div>
                    <p>ELIJE PUNTO</p>
                    <p>DE PARTIDA</p>
                    <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
                        <option value="">--Selecciona--</option>
                            {nodos.map((nodo, index) => (
                                <option key={index} value={nodo.properties.nombre}>
                                    {nodo.properties.nombre}
                                </option>
                            ))}
                    </select>
                </div>

                <div>
                    <p>ELIJE PUNTO</p>
                    <p>DE LLEGADA</p>
                    <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
                        <option value="">--Selecciona--</option>
                        {nodos.map((nodo, index) => (
                            <option key={index} value={nodo.properties.nombre}>
                                {nodo.properties.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="lonely-button">
                <input type="range" min="0" max="23" value={valor} onChange={manejarCambio}/>
                <p>{valor}:00</p>
                <button onClick={handleSimularTrafico}>Simular Trafico</button>
            </div>

            <div>
                {resultado}
            </div>
        </div>
    )
}

export default SimulationPage