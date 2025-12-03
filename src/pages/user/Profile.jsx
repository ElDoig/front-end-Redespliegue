import { useState } from 'react'

import { getCurrentUser, updateCurrentUser } from '../../auth'


export default function Profile(){
  const me = getCurrentUser()

  const [name, setName] = useState(me?.name || '')
  const [lastName, setLastName] = useState(me?.lastName || '')
  const [email, setEmail] = useState(me?.email || '')
  

  const [msg, setMsg] = useState('')


  async function save(e){ 
    e.preventDefault()
    

    if(!name.trim() || !lastName.trim() || !email.trim()){ 
      setMsg('Todos los campos son obligatorios'); 
      return 
    }
    
    setMsg('Guardando cambios en el servidor...'); 


    const result = await updateCurrentUser({ 
      name: name.trim(), 
      lastName: lastName.trim(), 
      email: email.trim() 
    });


    if (result.success) {
      setMsg('Datos actualizados permanentemente ✅');
    } else {
 
      setMsg(`Error al guardar: ${result.message || 'Inténtalo de nuevo.'}`);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="h2">Detalles de usuario</h2>
        {/* ... (Resto del JSX) ... */}
        <div className="grid-2" style={{alignItems:'center'}}>
          <div>
            <p style={{fontSize:22, fontWeight:800}}>{name} {lastName}</p>
            <p><b>Correo:</b> <span className="muted">{email}</span></p>
            <p><b>Fecha de registro:</b> <span className="muted">20/01/2025</span></p>
            <p><b>Estado:</b> <span className="badge">Activo</span></p>
          </div>
          <div className="center">
            <div className="avatar" />
          </div>
        </div>

        <h3 style={{marginTop:18}}>Editar datos</h3>
        <form onSubmit={save} className="grid-2">
          <div>
            <label>Nombre</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div>
            <label>Apellido</label>
            <input className="input" value={lastName} onChange={e=>setLastName(e.target.value)}/>
          </div>
          <div>
            <label>Correo</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div className="actions" style={{alignItems:'end'}}>
            <button className="btn">Guardar</button>
          </div>
        </form>
        {msg && <p className="muted" style={{marginTop:10}}>{msg}</p>}
      </div>
    </div>
  )
}