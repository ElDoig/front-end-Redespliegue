import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from './OrderService'; 

export default function OrderDetail(){
    const { orderId } = useParams();
    const nav = useNavigate();
    

    const [orderDetail, setOrderDetail] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError("ID de orden inválido.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true); 
                const data = await getOrderById(orderId); 
  
                if (!data) {
                    setError("No se encontró la orden.");
                } else {
                    setOrderDetail(data); 
                }
                setError(null);
            } catch (e) {
                console.error("Error al cargar la orden:", e);
                setError(e.message || "No se pudo cargar la información de la orden.");
                setOrderDetail(null);
            } finally {
                setLoading(false); 
            }
        };
        
        fetchOrder();
    }, [orderId]); 


    async function doCancel(){ 
        if(!orderDetail || !orderDetail.infoOrden) return;
        
        const idToDelete = orderDetail.infoOrden.id;

        if(window.confirm(`¿Deseas eliminar permanentemente la orden #${idToDelete}?`)){ 
            try {
 
                await cancelOrder(idToDelete); 
                
                alert(`Orden #${idToDelete} cancelada y eliminada.`); 
                nav('/user/orders', { replace: true }); 
            } catch (e) {

                console.error("Fallo al cancelar orden:", e);
                alert(`Error al cancelar la orden: ${e.message || 'Error desconocido'}`); 
            }
        }
    }

    if (loading) return <div className="container"><div className="card">Cargando detalles de la orden...</div></div>;
    if (error) return <div className="container"><div className="card text-error">{error}</div></div>;

    if (!orderDetail) return <div className="container"><div className="card">No se encontró la orden.</div></div>;


    const { infoOrden, productos } = orderDetail;



    return (
        <div className="container">
            <div className="card">
                <div className="orderHead">
             
                    <h2 className="h2">Orden <span style={{color:'var(--green)'}}>#{infoOrden.id}</span></h2>
                    <div className="spacer"></div>
                    <div className="right">
                       
                        <div>Estado: <span className="badge">{infoOrden.status || 'Pendiente'}</span></div> 
                        <div className="muted" style={{marginTop:6}}>
                            Monto total: 
                            <b>
                             
                                S/ {infoOrden.total?.toFixed(2) || '0.00'} 
                            </b>
                        </div>
                    </div>
                </div>

                <h3 style={{marginTop:10}}>Productos ordenados</h3>
                <table className="table">
                    <thead>
                      
                        <tr><th>ID Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Total Item</th></tr>
                    </thead>
                    <tbody>
                     
                        {(productos || []).map((item, i) => (
                            <tr key={i}>
                                <td>{item.idProducto}</td> 
                                <td>{item.cantidad}</td>
                                <td>S/ {item.precioUnit?.toFixed(2)}</td>
                                <td>S/ {(item.cantidad * item.precioUnit)?.toFixed(2) || '0.00'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

              
                <div style={{display:'flex', gap:22, marginTop:14}}>
                    <div className="card" style={{flex:1}}>
                        <h4>Detalles de Pago/Entrega</h4>
                        <p>Método de Entrega: **{infoOrden.metododeentrega || 'No especificado'}**</p>
                        <p className="muted">
                            Tarjeta: **{infoOrden.tipoTarjeta || 'No disponible'}** ({infoOrden.nroTarjeta || '****'})
                        </p>
                    </div>
                    
                    <div className="card" style={{flex:1}}>
                        <h4>Totales</h4>
                        <p>Subtotal: S/ {infoOrden.subTotal?.toFixed(2) || '0.00'}</p>
                        <p>Envío: S/ 0.00</p>
                        <hr />
                        <p><b>Total Final: S/ {infoOrden.total?.toFixed(2) || '0.00'}</b></p>
                    </div>
                </div>

                <div className="actions" style={{marginTop:14}}>
                    <button className="btn outline" onClick={doCancel}>Cancelar orden</button>
                </div>
            </div>
        </div>
    )
}