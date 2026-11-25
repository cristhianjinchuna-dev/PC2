import { useState } from "react"
import type { FormEvent } from "react"
import { Form, Link, useNavigate } from "react-router-dom"
import { api, apiError } from "../api"



export default function RegisterPage () {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSending(true);
        try {
            await api.post <{token: string}> ('/auth/register', {name: name.trim(), email, password});
            navigate('/login');
        } catch (err) {
            setError(apiError(err).message);
        } finally {
            setSending(false);
        }
    };
    
    
    return (
        <Form onSubmit={handleSubmit} className = 'mx-auto mt-16 flex max-w-sm flex-col gap-3 rounded border bg-white p-6'>
            <h1 className="text-xl font-bold">Iniciar Sesion</h1>

            <label htmlFor="name">Correo</label>
            <input id="name" required value = {name}
            onChange={e=>setName(e.target.value)} className="rounded border p-2" />

            <label htmlFor="email">Correo</label>
            <input id="email" type="email" required value = {email}
            onChange={e=>setEmail(e.target.value)} className="rounded border p-2" />

            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required value = {password}
            onChange={e=>setPassword(e.target.value)} className="rounded border p-2" />

            {error && <p className="text-red-600">{error}</p>}

            <button disabled={sending} className="rounded bg-slate-700 p-2 text-white disabled:bg-slate-300">
                {sending? 'Ingresando...' : 'Ingresar'}
            </button>

            <Link to = "/login" className = "text-center underline">
            Iniciar sesion
            </Link>

        </Form>
    );
}