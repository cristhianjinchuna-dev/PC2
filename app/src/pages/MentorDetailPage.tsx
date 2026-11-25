
import {useEffect, useState} from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, apiError } from '../api';
import type { Mentor } from '../api';



export default function MentorDetailPage () {
    const {id} = useParams();
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loadError, setLoadError] = useState('');
    const [topic, setTopic] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [result, setResult] = useState<{ok: boolean; text: string} | null>(null);
    const [sending, setSending] = useState(false);
    
    const load = () => {
        api.get<Mentor> (`/mentors/${id}`).then(r=> setMentor(r.data)).catch(err => 
            setLoadError(apiError(err).message));
    };

    useEffect(load, [id]);


    const handleSubmit = async(e: FormEvent <HTMLFormElement>) => {
        e.preventDefault();
        setResult(null);
        const t = topic.trim();
        const v = t.length < 5 || t.length > 100? 'El tema tiene que ser de 5 a 100 caracteres' : '';
        setFieldError(v);
        if(v) return;
        setSending(true);
        try{
            const {data} = await api.post<{id:number}>(`mentors/${id}/requests`, {topic: t});
            setResult({ok:true, text: `Reserva #${data.id} confirmada`});
        } catch(err) {
            const {code, message} = apiError(err);
            setResult({ok: false, text: code === 'NO_CAPACITY'? 'Ya no hay capacidad': message});
        } finally {
            setSending(false);
            load();
        }
    };

    if (loadError) return <p className='text-red-600'> {loadError}</p>;
    if (!mentor) return <p>Cargando...</p>
    
    
    return (
        <section className='flex flex-col gap-4'>
            <Link to = "/mentors" className='underline'> Volver al dashboard</Link>
            <div className='rounded border bg-white p-4'>
                <h1 className='text-xl font bold'> {mentor.name} </h1>
                <p>{mentor.description}</p>
                <p>Especialidad: {mentor.specialty}</p>
                <p>Cupos disponibles {mentor.availableSlots}</p>
            </div>

            <form onSubmit = {handleSubmit} noValidate className = "flex flex-col gap-2 rounded border bg-white p-4">
                <label htmlFor="topic">Tema de la mentoria</label>
                <input id="topic" type="text" value = {topic} onChange={e=>setTopic(e.target.value)} className='rounded border-2' />

                {fieldError && <p className = "text-sm text-red-600">{fieldError}</p>}
                <button disabled = {sending} className='rounded bg-slate-700 p-2 text-white disabled:bg-slate-300'>
                    {sending? 'Enviando...' : 'Reservar'}
                </button>

                {result && <p className={result.ok? 'rext-green-700':'text-red-600'}> {result.text}</p>}
            </form>

        </section>
    );
}