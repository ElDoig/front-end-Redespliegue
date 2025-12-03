import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


const API_BASE_URL = "https://progra-back-end.vercel.app"; 


export const getCurrentUser = () => {
    try {

        const token = localStorage.getItem('token'); 
        
        if (!token) {
            return null;
        }

        const decoded = jwtDecode(token);
        

        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }


        return decoded; 
    } catch (e) {
        
        console.error("Error decodificando el token:", e);
        localStorage.removeItem('token');
        return null;
    }
};




export const updateCurrentUser = async (newData) => {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
   
        return { success: false, message: 'No hay sesión activa.' }; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newData),
        });

        const data = await response.json();

        if (response.ok) {
     
            return { success: true, message: data.message || 'Datos actualizados.' };
        } else {
      
            return { success: false, message: data.message || 'Error al actualizar datos en el servidor.' };
        }

    } catch (error) {
        console.error("Fallo de conexión al actualizar:", error);
   
        return { success: false, message: 'Error de conexión con el servidor.' }; 
    }
    
};
export function useSession(){
    

    const [user, setUser] = useState(() => getCurrentUser());
    const [loading, setLoading] = useState(true);


    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                
                localStorage.setItem('token', data.token);
 
                setUser(getCurrentUser()); 

                return { success: true, message: 'Inicio de sesión exitoso.' };
            } else {
                return { success: false, message: data.message || 'Credenciales incorrectas.' };
            }
        } catch (error) {
            console.error('Error de conexión en login:', error);
            return { success: false, message: 'Error de conexión con el servidor.' };
        }
    };

  
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null); 
    };



    useEffect(() => {
        setLoading(false);
    }, []);


    return {
        user,
        login, 
        logout, 
        isLogged: !!user,
        isAdmin: user?.rol === 'admin',
        loading,
    }
}