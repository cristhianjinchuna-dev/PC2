import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import MentorDetailPage from "./pages/MentorDetailPage"
import MentorsPage from "./pages/MentorsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MyRequestPage from "./pages/MyRequestPage"


function ProtectedLayout() {
  const navigate = useNavigate();
  if(!localStorage.getItem('token')) return <Navigate to = "login" replace />;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <>
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <span className="font-bold"> Mentores UTEC </span>
        <button onClick={logout} className="rounded bg-slate-700 px-3 py-1 text-white">
          Cerrar Sesión
        </button>
      </header>
      <main className="mx-auto max-w-4xl p-6">
        <Outlet/>
      </main>
    </>
  )

}


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Navigate to = "/mentors" replace/>}/>
          <Route path = "/login" element = {<LoginPage/>}/>
          <Route path = "/register" element = {<RegisterPage/>}/>
          <Route element = {<ProtectedLayout/>}>
            <Route path = "/mentors" element = {<MentorsPage/>}/>
            <Route path = "/mentors:id" element = {<MentorDetailPage/>}/>
            <Route path = "/me/requests" element = {<MyRequestPage/>}/>


          </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App
