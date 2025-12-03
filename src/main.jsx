import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AboutUs from './routes/AboutUsPage.jsx'
import Login from './routes/LoginPage.jsx'
import ProductosPage from './routes/ProductosPage.jsx'
import DashboardAPage from './routes/DashboardAdminPage.jsx'
import CategoryList from './pages/admin/CategoryList'
import CategoryForm from './pages/admin/CategoryForm'
import CategoryDetail from './pages/admin/CategoryDetail'
import OrderDetail from './pages/user/OrderDetail.jsx'

import Profile from './pages/user/Profile'
import ChangePassword from './pages/user/ChangePassword.jsx'
import Carrito from './pages/user/Carrito/Carrito.jsx'
import Checkout from './pages/user/Checkout/Checkout.jsx'
import PaymentMethod from './pages/user/Checkout/PaymentMethod/PaymentMethod.jsx'
import Card from './pages/user/Checkout/Card/Card.jsx'
import QR from './pages/user/Checkout/QR/QR.jsx'
import Pago from './pages/user/Checkout/Pago/Pago.jsx'
import { RequireAdmin, RequireLogin } from './components/Guard'
import GameCardCatalog from './components/GameCardCatalog/GameCardCatalog.jsx'
import catalogIMG from './data/catalogIMG.js'
import BestSeller from './components/BestSeller/BestSeller.jsx'
import hotsale from './data/hotsale'
import './App.css'
import Registro from './routes/RegistroPage.jsx'
import Recuperacion from './routes/RecuperacionPage.jsx'
import { SessionProvider } from './components/Login/Session.jsx'; 


function Home() {
  return (
    <div className="container">
      <section className="banner">
        <a href=""><img src="https://slider.eneba.games/resized/tzTuVy4rHd4EnUUQbLml2o1nbo8MN7TIWwjbekeNUqY_1500x400_1x-1500x400_150_0.jpg"
  alt="banner"
  style={{
    display: "block",
    margin: "0 auto",
    width: "100%",
    maxWidth: "1500px",
    borderRadius: "10px"
  }}/></a>
      </section>
    <h2 style={{ textAlign: "left", marginTop: "10px" }}>Explora más categorías:</h2>
      <div className="catalog-container">
        {catalogIMG.map((item) => (
          <GameCardCatalog key={item.id} titulo={item.Categoria} img={item.img} />
        ))}
      </div>
      <h2 style={{ textAlign: "left", marginTop: "40px" }}>Lo más vendido:</h2>
      <div className="most-sold-container">
        {hotsale.map((item) => (
          <BestSeller 
            key={item.id} 
            titulo={item.titulo} 
            categoria={item.categoria} 
            precio={item.precio} 
            img={item.img} 
          />
        ))}
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App><Home /></App>
  },
  {
    path: "inicio",
    element: <App><Home /></App>
  },
  {
    path: "acerca",
    element: <App><AboutUs /></App>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/registro",
    element: <Registro /> 
  },
{
    path: "/recuperar-password",
    element: <Recuperacion /> 
  },

  {
    path: "/mantenimiento/productos",
    element: <App><ProductosPage /></App>
  },
  {
    path: "/admin",
    element: <App><DashboardAPage /></App>
  },

  {
    path: "/admin/categories",
    element: <App><RequireAdmin><CategoryList /></RequireAdmin></App>
  },
  {
    path: "/admin/categories/new",
    element: <App><RequireAdmin><CategoryForm /></RequireAdmin></App>
  },
  {
    path: "/admin/categories/:id",
    element: <App><RequireAdmin><CategoryDetail /></RequireAdmin></App>
  },
  {
    path: "/user/orders", 
    element: <App><RequireLogin><OrderDetail /></RequireLogin></App> 
  },
  {
    path: "/user/profile",
    element: <App><RequireLogin><Profile /></RequireLogin></App>
  },
  {
    path: "/user/change-password",
    element: <App><RequireLogin><ChangePassword /></RequireLogin></App>
  },
  {
    path: "/carrito",
    element: <App><Carrito /></App>
  },
  {
    path: "/checkout/card",
    element: <App><Card /></App>
  },
  {
    path: "/checkout",
    element: <App><Checkout /></App>
  },
  {
    path: "/checkout/payment",
    element: <App><PaymentMethod /></App>
  },
  {
    path: "/checkout/qr",
    element: <App><QR /></App>
  },
  {
    path: "/checkout/pago",
    element: <App><Pago /></App>
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
    <RouterProvider router={router}/>
    </SessionProvider>
  </StrictMode>,
)