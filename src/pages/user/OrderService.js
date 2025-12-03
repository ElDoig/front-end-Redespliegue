
const API_BASE_URL = "https://progra-back-end.vercel.app"; 


const getToken = () => localStorage.getItem('token'); 


export const getOrderById = async (orderId) => {
    const token = getToken();
    if (!token) throw new Error("No autenticado. Token no encontrado.");

    const response = await fetch(`${API_BASE_URL}/ordenes/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    // Manejar el caso de "No encontrado" (404)
    if (response.status === 404) {
        return null; 
    }

    if (!response.ok) {
        throw new Error(`Error al obtener la orden: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};



export const cancelOrder = async (orderId) => {
    const token = getToken();
    if (!token) throw new Error("No autenticado. Token no encontrado.");

    try {
        
        const response = await fetch(`${API_BASE_URL}/ordenes/${orderId}/cancel`, {
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(errorData.message || `Fallo la cancelación. Código: ${response.status}`);
        }

        return response.json(); 
    } catch (error) {
        console.error("Error al cancelar orden:", error);
        throw error; 
    }
};

export const getUserOrders = async () => {
    const token = getToken();
    if (!token) throw new Error("No autenticado. Token no encontrado.");


    const response = await fetch(`${API_BASE_URL}/ordenes`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener el listado de órdenes.');
    }

    const data = await response.json();
    return data; 
};