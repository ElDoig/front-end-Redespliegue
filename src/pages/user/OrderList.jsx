import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders } from './OrderService'; 

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getUserOrders(); 
                setOrders(data); 
                setError(null);
            } catch (e) {
                console.error("Error al cargar la lista de órdenes:", e);
                
                if (e.message.includes("No autenticado")) {
                    nav('/login');
                }
                setError("No se pudo cargar la lista de órdenes.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [nav]); 


    if (loading) return <div className="container">Cargando tus órdenes...</div>;
    if (error) return <div className="container text-error">{error}</div>;


    return (
        <div className="container">
            <h1>Mis Órdenes</h1>
            
            {orders.length === 0 ? (
                <p>Aún no has realizado ninguna orden.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.fecha).toLocaleDateString()}</td>
                                
                                
                                <td>S/ {parseFloat(order.total || 0).toFixed(2)}</td> 
                                
                                <td>
                                    <Link to={`/user/orders/${order.id}`} className="btn-link">Ver Detalle</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}