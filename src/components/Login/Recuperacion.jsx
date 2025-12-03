import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar useNavigate
// import './Recuperacion.css'; // Asegúrate de tener tu archivo CSS

const API_BASE_URL = "https://progra-back-end.vercel.app"; 

export default function RecuperarPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !password || !confirmPassword) {
            return setError("Todos los campos son obligatorios.");
        }

        if (password !== confirmPassword) {
            return setError("Las contraseñas no coinciden. Por favor, revísalas.");
        }

     
        if (password.length < 6) {
            return setError("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        
        setMessage("Actualizando contraseña...");

        try {
            // 3. Llamada al Back-end
            const response = await fetch(`${API_BASE_URL}/auth/recuperar-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            
                body: JSON.stringify({ email, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Contraseña actualizada con éxito. Redirigiendo al login...');
                
            
                setTimeout(() => {
                    navigate('/login'); 
                }, 2000);

            } else {
                setError(data.message || 'Error al actualizar la contraseña. Verifica el correo.');
            }

        } catch (err) {
            console.error('Error de red:', err);
            setError('No se pudo conectar con el servidor.');
        }
    };

    return (
        <div className="login-container">
            <h2>Recuperar contraseña</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Nueva Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite la nueva contraseña"
                        required
                    />
                </div>


                {(error || message) && <p className={error ? "error" : "success"}>{error || message}</p>}

                <button type="submit" className="btn-login">
                  Actualizar Contraseña
                </button>

                <div className="login-links">
                    <Link to="/login">Volver al inicio de sesión</Link>
                </div>
            </form>
        </div>
    );
}