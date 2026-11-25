import { useEffect,useState } from "react";
import { api, apiError } from "../api";
import type { Booking } from "../api";


export default function MyRequestPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        api.get<Booking[]>('/me/requests')
        .then(r=>setBookings(r.data))
        .catch(err => setError(apiError(err).message))
        .finally(()=>setLoading(false));
    };

    useEffect(load. []);
    

    const cancel = async(b:Booking) => {
        if (!window.confirm(`¿cancelar la mentoria #${b.id}`)) return;
        setMessage('');
        try {
            await api.patch(`/requests/${b.id}/cancel`);
            setMessage('Reserva cancelada');
        } catch (err) {
            const {code, message} = apiError(err);
            setMessage(code === 'INVALID_STATE'? 'La reserva, cambio, se actualizo la lista' : message);
        }
        load();
    };


    return (
        <section className = "flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Mis mentorias</h1>
            {message && <p className="rounded bg-slate-100 p-2">{message}</p>}
            {loading? (<p>Cargando...</p>): error? (
                <div>
                    <p className="text-red-600">{error}</p>
                    <button onClick={load} className="underline">Reintentar</button>
                </div>
            ): bookings.length === 0? (
                <p>No tiene mentorias</p>
            ) :(
                <ul className="flex flex-col gap-2">
                    {bookings.map(b=> (
                        <li key = {b.id} className="flex items-center justify-center rounded border bg-white p-3">
                            <span>#{b.id} - {b.resourcename} - {b.topic}</span>
                            {b.status === 'ACTIVE' && (
                                <button onClick = {() => cancel(b)} className="rounded bg-red-600 px-3 py-1 text-white"> cancelar</button>
                            )}
                        </li>
                    ))}

                </ul>
            )}

        </section>
    );
}