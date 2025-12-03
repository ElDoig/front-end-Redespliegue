//import { useSession } from '../auth'
//import { Link , useNavigate } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../auth';

export default function NavBar(){
  const { user, isAdmin, isLogged, logout } = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirige al inicio
  };

  const handleCuentaClick = () => {
    if (!isLogged) navigate('/login');
    else navigate('/user/profile');
  };
  const handleCarritoClick = () => {
    navigate('/carrito'); 
  };
  return (
    <>
      <div className="topbar">
        <div className="brand">GamePlay <span className="dot"></span></div>
        <div className="search">
          <input placeholder="Buscar un producto..." />
          <span>🔍</span>
        </div>
        <button className="pill" onClick={handleCarritoClick}>🛒 Carrito  S/ 100.00</button>

        {isLogged ? (
          <button className="iconbtn" onClick={handleLogout}>
            👤 {user?.usuario} <span className="muted">(Cerrar sesión)</span>
          </button>
        ) : (
          <button className="iconbtn" onClick={handleCuentaClick}>
            👤 Ingresar <span className="muted">cuenta</span>
          </button>
        )}
      </div>

      <div className="subnav">
        <span>☰</span>
        <Link to="/">Home</Link>
        {isAdmin && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/mantenimiento/productos">Productos</Link>
            <Link to="/admin/categories">Listado categorías</Link>
            <Link to="/admin/categories/new">Agregar categoría</Link>
          </>
        )}
        {isLogged && (
          <>
            <Link to="/user/profile" style={{ marginLeft: 'auto' }}>Mi perfil</Link>
            <Link to="/user/change-password" style={{ marginLeft: '12px' }}>Cambiar contraseña</Link>
            <Link to="/user/orders" style={{ marginLeft: '12px' }}>Mis órdenes</Link>
          </>
        )}
      </div>
    </>
  );
}