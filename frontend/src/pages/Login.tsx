import { Link } from "react-router-dom"


const Login = () => {
  return (
    <div className="flex justify-center">
        <div className="h-screen flex flex-col justify-center">
            <div className="shadow-md p-5 rounded-lg">
                <p className="font-bold text-2xl text-gray-700">
                    Welcome to  To-Do app
                </p>
                <div className="flex flex-col justify-center p-5 gap-3 items-center">
                    <input type="text" placeholder="Username" className="rounded border-black border p-1"></input>
                    <input type="text" placeholder="Password" className="border-black rounded border p-1"></input>
                    <button className="border bg-black text-white w-24 rounded p-1">Login</button>
                    <p>
                        Don't have a account 
                        <Link to={'/register'} className="pl-1 font-bold underline">
                            Register?
                        </Link> 
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login