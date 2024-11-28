import { Link, useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate()

  return (
    <header className="flex justify-between items-center pb-6 border-b">
        <Link to={'/dashboard'}>
            <h1 className="text-2xl font-bold">Dashboard</h1>
        </Link>
        <Link to={'/tasks'}>
            <h1 className="text-2xl font-bold">Task-List</h1>
        </Link>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login')
          }}
        >
          Sign Out
        </button>
      </header>
  )
}

export default Header