import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; 

const API_BASE_URL = "https://progra-back-end.vercel.app"; 

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [telefono, setTelefono] = useState(""); 

  const [esAdminCheck, setEsAdminCheck] = useState(false);
  const [rol, setRol] = useState('cliente'); 

  const [mensaje, setMensaje] = useState(null); 
  const navigate = useNavigate();


  const handleAdminCheck = (e) => {
    const isChecked = e.target.checked;
    setEsAdminCheck(isChecked);
    setRol(isChecked ? 'admin' : 'cliente'); 
  };


  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje(null);

 

    if (!nombre || !apellido || !email || !usuario || !password || !direccion || !ciudad || !telefono) {
      setMensaje({ type: 'error', text: "Por favor completa todos los campos, incluyendo el teléfono." });
      return;
    }
    
    try {
  
      const response = await fetch(`${API_BASE_URL}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nombre,
          apellido,
          email,
          usuario,
          password,
          direccion,
          ciudad,
          telefono, 
          rol 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ type: 'success', text: `Registro exitoso como ${rol}. Serás redirigido para iniciar sesión.` });
        setTimeout(() => navigate("/"), 2000); 
      } else {
        setMensaje({ type: 'error', text: data.message || "Fallo en el servidor al intentar registrar." });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje({ type: 'error', text: "Error de conexión. Verifica que el Back-end esté encendido." });
    }
  };

  return (
    <div className="login-container">
      <h2>Crear cuenta nueva</h2>

      <form onSubmit={handleRegistro} className="login-form">

        
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Tu apellido"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Calle y número"
          />
        </div>


        <div className="form-group">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Tu ciudad"
          />
        </div>
        

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 555-1234"
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <div className="form-group-checkbox">
            <input 
                type="checkbox" 
                id="esAdmin" 
                checked={esAdminCheck}
                onChange={handleAdminCheck}
            />
            <label htmlFor="esAdmin">Crear cuenta como **Administrador (Pruebas)**</label>
        </div>



        {mensaje && (
          <p className={mensaje.type === 'error' ? 'error' : 'success'}>
            {mensaje.text}
          </p>
        )}

        <button type="submit" className="btn-login">
          Registrarse
        </button>

        <div className="login-links">
          <Link to="/Login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
        
      </form> 
    </div> 
  );
}