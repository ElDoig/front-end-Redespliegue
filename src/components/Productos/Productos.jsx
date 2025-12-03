import { useState, useEffect } from 'react'
import FormularioProducto from "./FormularioProducto/FormularioProducto"
import './Productos.css'
import CategoriaProducto from './Categorias/Categorias'

const getCategorias = (productos) => Array.from(new Set(productos.map(p => p.categoria)))
const getPresentaciones =  (productos) => Array.from(new Set(productos.map(p => p.presentacion)))

const Productos = () => {
    const baseUrl = "https://progra-back-end.vercel.app/producto"
    const [productos, setProductos] = useState([])
    const [showForm, setShowForm ] = useState(false)
    const [search, setSearch ] = useState("")
    const [showCategorias, setShowCategorias] = useState(false)
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [productoEditar, setProductoEditar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mapFromApi = (p) => ({
        id: p.id,
        titulo: p.nombre ?? "",
        presentacion: p.marca ?? "",
        descripcion: p.descripcion ?? "",
        categoria: p.categoria ?? "",
        stock: p.stock ?? 0,
        img: p.img ?? "",
        precio: p.precio ?? 0
    })
    const mapToApi = (p) => ({
        id: p.id,
        nombre: p.titulo,
        marca: p.presentacion,
        descripcion: p.descripcion,
        categoria: p.categoria,
        stock: Number(p.stock),
        img: p.img,
        precio: Number(p.precio)
    })

    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem('token')
                const headers = token ? { Authorization: `Bearer ${token}` } : {}
                const res = await fetch(baseUrl, { headers })
                if (!res.ok) throw new Error(`Error ${res.status}`)
                const data = await res.json()
                const arr = Array.isArray(data) ? data : (data.rows ?? data)
                setProductos(arr.map(mapFromApi))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProductos()
    }, [])

    const presentaciones = getPresentaciones(productos)
    const categorias = getCategorias(productos)
    
    const productosFiltrados = productos.filter(p =>
        p.titulo.toLowerCase().includes(search.toLowerCase()) &&
        (categoriaSeleccionada === "" || p.categoria === categoriaSeleccionada)
    )

    const handleGuardarProducto = async (nuevoProducto) => {
        try {
            const token = localStorage.getItem('token') // <-- declarar token aquí
            if (productoEditar) {
                const payload = mapToApi({ ...nuevoProducto, id: productoEditar.id })
                const res = await fetch(`${baseUrl}/${productoEditar.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
                    body: JSON.stringify(payload)
                })
                if (!res.ok) {
                    const body = await res.text().catch(()=>null)
                    throw new Error(`Error al actualizar (${res.status}) ${body ? '- ' + body : ''}`)
                }
                const updated = await res.json()
                setProductos(productos.map(p => p.id === updated.id ? mapFromApi(updated) : p))
                setProductoEditar(null)
            } else {
                const payload = mapToApi(nuevoProducto)
                const res = await fetch(baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
                    body: JSON.stringify(payload)
                })
                if (!res.ok) {
                    const body = await res.text().catch(()=>null)
                    throw new Error(`Error al crear (${res.status}) ${body ? '- ' + body : ''}`)
                }
                const created = await res.json()
                setProductos([...productos, mapFromApi(created)])
            }
            setShowForm(false)
        } catch (err) {
            console.error(err)
            alert("Error: " + err.message)
        }
    }

    const handleEliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return
        try {
            const token = localStorage.getItem('token') // <-- declarar token aquí
            const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
            if (!res.ok) {
                const body = await res.text().catch(()=>null)
                throw new Error(`Error al eliminar (${res.status}) ${body ? '- ' + body : ''}`)
            }
            setProductos(productos.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
            alert("Error: " + err.message)
        }
    }

    const handleEditarProducto = (producto) => {
        setProductoEditar(producto)
        setShowForm(true)
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
            <h1>Listado de productos</h1>
            {loading && <p>Cargando productos...</p>}
            {error && <p style={{color:'red'}}>Error: {error}</p>}
            <div className="botones">
                <div className="search" >
                    <input
                        type="text"
                        placeholder="Buscar un producto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <i className="fa fa-search"></i>
                </div>
                <button className="boton" onClick={() => setShowCategorias(!showCategorias)}>
                    <i className="fa fa-list"></i>
                    Categorías
                </button>
                <button className="boton" onClick={() => {setShowForm(!showForm); setProductoEditar(null);}}>+ Agregar Producto</button>
            </div>
            {showCategorias && <CategoriaProducto
                categoriaSeleccionada={categoriaSeleccionada}
                setCategoriaSeleccionada={setCategoriaSeleccionada}
                setShowCategorias={setShowCategorias}
            />}  
            <br /><br />
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Presentación</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productosFiltrados.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <img src={p.img} alt={p.titulo} className="product-img" />
                                </td>
                                <td className="id-cell">#{p.id}</td>
                                <td>{p.titulo}</td>
                                <td>{p.presentacion}</td>
                                <td>{p.descripcion}</td>
                                <td>{p.categoria}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className="action-btn" title="Editar" onClick={() => handleEditarProducto(p)}><i className="fa fa-pencil"></i></button>
                                    <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminarProducto(p.id)}><i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table> 
            {showForm && <FormularioProducto categorias={categorias}
                presentaciones={presentaciones}
                onGuardar={handleGuardarProducto}
                productoEditar={productoEditar}
                onCerrar={() => { setShowForm(false); setProductoEditar(null); }}/>}
        </>
    )
}

export default Productos