import { Link } from "react-router-dom";
import type { Mentor } from "../api";

interface Props {
    mentor: Mentor;
    linkToDetail?: boolean;
}

export default function MentorCard({mentor,linkToDetail = false}: Props){
    const content = (
        <>
            <h2 className="text-lg font-bold">{mentor.name}</h2>
            <p>Especialidad: {mentor.specialty}</p>
            <p>Modalidad: {mentor.modality}</p>
            <p>Cupos disponibles: {mentor.availableSlots}</p>
        </>
    );

    const className = 'flex flex-col gap-1 rounded border bg-white p-4';

    return linkToDetail? (
        <Link to = {`/mentors/${mentor.id}`} className={`${className} hover:border-slate-500`}>{content} </Link>
    ) : (
        <div className = {className}> {content} </div>
    );
}