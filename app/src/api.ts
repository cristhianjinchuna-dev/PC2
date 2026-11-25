import axios from "axios";

export interface Mentor {
    id: number;
    name: string;
    specialty: string;
    modality: string;
    availableSlots: number;
    description: string;
}

export interface Page <T> {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

export interface Booking{
    id:number;
    resourceId:number;
    resourcename: string;
    topic: string;
    status: string;
}

export const api = axios.create({baseURL: 'https://mentoriautec-api.aaron-navarro.workers.dev/api'});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && !config.url?.includes('/auth'))
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && 
    !error.config?.url?.includes('/auth')){
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
    },
)

export function apiError(err:unknown) {
    if (axios.isAxiosError<{code: string; message: string}>(err) && err.response) {
        return {code: err.response.data?.code, message: err.response.data?.message?? 'Ocurrio un error'};

    }
    return {code:undefined, message: 'No se pudo conectar con el servidor'}
}