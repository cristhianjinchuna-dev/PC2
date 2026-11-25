import { useEffect, useState } from "react"
import { api, apiError } from "../api"
import type { Mentor, Page } from "../api"
import MentorCard from "../components/MentorCard"
import Pagination from "../components/Pagination"

const SIZE = 5;

export default function MentorsPage () {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Page<Mentor> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        api.get<Page<Mentor>>('/mentors', {params: {page, SIZE}})
            .then(r => setData(r.data))
            .catch(err => setError(apiError(err).message))
            .finally(() => setLoading(false));
    };

    useEffect(load, [page]);

    const changePage = (next:number) => {
        setLoading(true);
        setPage(next);
    };


    return (
        <section className="flex flex-col gap-4">
            <h1 className = "text-2xl font-bold"> Mentores </h1>
            {!loading && error && (<div>
                <p className = "text-red-600">{error}</p>
                <button onClick={load} className="underline">Reintentar</button>
            </div>)}
            {!loading && data && (
                <>
                    {data.items.length === 0? (
                        <p> No hay mentores para mostrar</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {data.items.map(mentor => (
                                <MentorCard key = {mentor.id} mentor = {mentor} linkToDetail/>
                            ))}

                            <Pagination page = {data.page} totalPages={data.totalPages} onChange={changePage}/>

                        </div>
                    )}}
                </>
            );
        </section>
        
}