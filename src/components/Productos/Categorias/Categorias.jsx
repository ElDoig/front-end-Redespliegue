import { useState,useEffect } from 'react'
import './Categorias.css'

const CategoriaProducto = ({
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    setShowCategorias
}) => {

    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                const headers = token ? { Authorization: `Bearer ${token}` } : {}
                const res = await fetch('https://progra-back-end.vercel.app/producto', { headers })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                const arr = Array.isArray(data) ? data : (data.rows ?? data)
                const cats = Array.from(new Set(arr.map(p => p.categoria).filter(Boolean)))
                setCategorias(cats)
            } catch (err) {
                setError(err.message)
                setCategorias([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategorias()
    }, [])
    return ( 
        <div className='form'>
            <div className='content'>
                <h2 style={{marginTop:0}}>Selecciona una categoría</h2>

                {loading && <p>Cargando categorías...</p>}
                {error && <p style={{color:'red'}}>Error: {error}</p>}

                <select className='select'
                    value={categoriaSeleccionada}
                    onChange={e => setCategoriaSeleccionada(e.target.value)}
                >
                    <option value="">Todas</option>
                    {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className='cerrar'>
                    <button className="btn outline" onClick={() => setShowCategorias(false)}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default CategoriaProducto