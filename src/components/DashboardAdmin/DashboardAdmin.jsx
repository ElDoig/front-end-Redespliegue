// ...existing code...
import { useState, useEffect } from 'react'
import './DashboardAdmin.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DashboardA = () => {
    const API_BASE_URL = "https://progra-back-end.vercel.app"; 
    const USUARIO_ENDPOINT = 'auth' // tu endpoint real para usuarios
    const ORDEN_ENDPOINT = 'ordenes' // tu endpoint real para ordenes

    const dashboardDefault = {
        ordenes: 0,
        usuariosNuevos: 0,
        ingresosTotales: 0,
        fecha: ""
    }

    const today = new Date()
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(today.getDate() - 7)

    const [dashboard, setDashboard] = useState(dashboardDefault)
    const [startDate, setStartDate] = useState(sevenDaysAgo)
    const [endDate, setEndDate] = useState(today)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchArray = async (path) => {
        try {
            const token = localStorage.getItem('token')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const res = await fetch(`${API_BASE}/${path}`, { headers })
            if (!res.ok) {
                const body = await res.text().catch(()=>null)
                throw new Error(`HTTP ${res.status} ${body ? '- ' + body : ''}`)
            }
            const data = await res.json()
            return Array.isArray(data) ? data : (data.rows ?? data)
        } catch (err) {
            throw err
        }
    }

    const parseDate = (item, possibleFields = []) => {
        for (const f of possibleFields) {
            if (item && item[f]) {
                const val = item[f]
                // intentar parse estándar
                let d = (val instanceof Date) ? val : new Date(val)
                if (isNaN(d)) {
                    // intentar forzar formato ISO (reemplazar espacio entre fecha y hora por 'T')
                    try {
                        const s = String(val).trim().replace(' ', 'T')
                        d = new Date(s)
                    } catch (e) {
                        d = null
                    }
                }
                return isNaN(d) ? null : d
            }
        }
        if (item && item.createdAt) {
            const v = item.createdAt
            let d = (v instanceof Date) ? v : new Date(v)
            if (isNaN(d)) {
                try { d = new Date(String(v).trim().replace(' ', 'T')) } catch(e){ d = null }
            }
            return isNaN(d) ? null : d
        }
        if (item && item.fecha) {
            const v = item.fecha
            let d = (v instanceof Date) ? v : new Date(v)
            if (isNaN(d)) {
                try { d = new Date(String(v).trim().replace(' ', 'T')) } catch(e){ d = null }
            }
            return isNaN(d) ? null : d
        }
        for (const k of Object.keys(item || {})) {
            if (k.toLowerCase().includes('fecha') || k.toLowerCase().includes('created') || k.toLowerCase().includes('date')) {
                const v = item[k]
                let d = (v instanceof Date) ? v : new Date(v)
                if (isNaN(d)) {
                    try { d = new Date(String(v).trim().replace(' ', 'T')) } catch(e){ d = null }
                }
                return isNaN(d) ? null : d
            }
        }
        return null
    }

    const getOrderTotal = (order) => {
        // schema muestra columna 'total'
        if (!order) return 0
        if (order.total != null) {
            const n = Number(order.total)
            return isNaN(n) ? 0 : n
        }
        // buscar cualquier campo numérico
        for (const k of Object.keys(order)) {
            const v = Number(order[k])
            if (!isNaN(v) && v > 0) return v
        }
        return 0
    }
    const dateOnly = (d) => {
        if (!d) return null
        const dt = new Date(d)
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    }
    const inRange = (d, start, end) => {
        if (!d) return false
        const dd = dateOnly(d)
        const s = dateOnly(start)
        const e = dateOnly(end)
        if (!dd || !s || !e) return false
        // logs para depuración
        console.debug('Comparing dateOnly:', { itemDate: dd.toISOString(), start: s.toISOString(), end: e.toISOString() })
        return dd.getTime() >= s.getTime() && dd.getTime() <= e.getTime()
    }

    
    const calcularDashboard = async (desde, hasta) => {
        setLoading(true)
        setError(null)
        try {
            const [users, orders] = await Promise.all([
                fetchArray(USUARIO_ENDPOINT),
                fetchArray(ORDEN_ENDPOINT)
            ])

            // --- LOG: mostrar todos los usuarios recibidos ---
            console.log('Usuarios recibidos desde API:', users)

            // Mapear usuarios con su fecha parseada para depuración
            const usersWithDates = (users || []).map(u => {
                const parsed = parseDate(u, ['createdAt', 'created_at', 'fecha'])
                return {
                    raw: u,
                    parsedDate: parsed ? parsed.toISOString() : null
                }
            })
            console.log('Usuarios con fecha parseada:', usersWithDates)

            const usersInRange = (users || []).filter(u => {
                const d = parseDate(u, ['createdAt', 'created_at', 'fecha', 'fechaCreacion'])
                return inRange(d, desde, hasta)
            })

            // --- LOG: mostrar usuarios que cumplen el rango ---
            console.log(`Usuarios dentro del rango ${desde.toISOString()} - ${hasta.toISOString()}:`, usersInRange)

            const ordersInRange = (orders || []).filter(o => {
                const d = parseDate(o, ['fecha', 'createdAt'])
                return inRange(d, desde, hasta)
            })

            const ingresos = ordersInRange.reduce((acc, o) => acc + getOrderTotal(o), 0)

            setDashboard({
                ordenes: ordersInRange.length,
                usuariosNuevos: usersInRange.length,
                ingresosTotales: ingresos,
                fecha: `${desde.toLocaleDateString()} - ${hasta.toLocaleDateString()}`
            })
        } catch (err) {
            setError(err.message || 'Error al obtener datos')
            setDashboard(dashboardDefault)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        calcularDashboard(startDate, endDate)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        calcularDashboard(startDate, endDate)
    }

    return (
        <form onSubmit={handleSubmit}>
            <main>
                <h1>Dashboard</h1>
                <div className="rango">
                    <div>
                        <label>Desde:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            maxDate={endDate}
                        />
                    </div>
                    <div>
                        <label>Hasta:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                        />
                    </div>
                    <button type="submit">Buscar</button>
                </div>

                {loading && <p>Cargando datos...</p>}
                {error && <p style={{color:'red'}}>{error}</p>}

                <section>
                    <div className="d">
                        <h2><b>Órdenes:</b></h2>
                        <h2>{dashboard.ordenes}</h2>
                    </div>
                    <div className="d">
                        <h2><b>Usuarios nuevos:</b></h2>
                        <h2>{dashboard.usuariosNuevos}</h2>
                    </div>
                    <div className="d">
                        <h2><b>Ingresos totales:</b></h2>
                        <h2>S/ {dashboard.ingresosTotales.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h2>
                    </div>
                    <div style={{marginTop:10}}>
                        <small>Rango: {dashboard.fecha}</small>
                    </div>
                </section>
            </main>
        </form>
    )
}

export default DashboardA
