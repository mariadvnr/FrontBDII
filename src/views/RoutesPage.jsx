import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./styles/styleRoutesPage.css"


const RoutesPage = () => {
    const navigate = useNavigate()

    const [nodos, setNodos] = useState([]);
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
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
    
    const handleClickSimular = () => {
        navigate('/simulartrafico');
    }

    const handleCalcularRuta = () => {
        if (!startNode || !endNode) {
        alert('Por favor, selecciona un nodo de inicio y de fin.');
        return;
        }

        if (startNode === endNode) {
        alert('El nodo de inicio y fin no pueden ser el mismo.');
        return;
        }

        setResultado(<p>Calculando...</p>);

        fetch(`http://localhost:5001/ruta-mas-corta?start_node=${encodeURIComponent(startNode)}&end_node=${encodeURIComponent(endNode)}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error en la red: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setResultado(<p>Error: {data.error}</p>);
                    return;
                }

                if (!data.path || data.path.length === 0) {
                    setResultado(<p>No se encontró una ruta entre los nodos seleccionados.</p>);
                    return;
                }

                const ruta = (
                    <div className="resultados-container">
                        <h2>RUTA MAS CORTA</h2>
                        {data.path.map((segmento, index) => {
                            const props = segmento.relationship.properties;
                            return (
                            <p key={index}>
                                <b>{segmento.start_node}</b> → <b>{segmento.end_node}</b> ({props.tiempo_minutos} minutos con tráfico {props.trafico_actual})
                            </p>
                            );
                        })}
                        <p className="tiempo-total">Tiempo Total: {data.total_cost.toFixed(2)} minutos</p>
                    </div>
                );
                setResultado(ruta);
            })
            .catch(error => {
                console.error('Error al calcular la ruta:', error);
                setResultado(<p>Ocurrió un error al calcular la ruta: {error.message}. Revisa la consola.</p>);
            });
    };

    return (
        <div className="container-routes">
           <div className="header-container">
                <h1>Deli-Very</h1>
                <div>
                    <button onClick={handleClickSimular}>Simular Trafico</button>
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
                <button onClick={handleCalcularRuta}>Calcular Ruta</button>
            </div>

            <div>
                {resultado}
            </div>
        </div>
    )
}

export default RoutesPage