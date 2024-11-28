import { Link } from "react-router-dom"


const Register = () => {
  return (
    <div className="flex justify-center">
        <div className="h-screen flex flex-col justify-center">
            <div className="shadow-md p-5 rounded-lg">
                <p className="font-bold text-2xl text-gray-700">
                    Welcome to  To-Do app
                </p>
                <div className="flex flex-col justify-center p-5 gap-3 items-center">
                    <input type="text" placeholder="Email" className="rounded border-black border p-1"></input>
                    <input type="text" placeholder="Username" className="rounded border-black border p-1"></input>
                    <input type="text" placeholder="Password" className="border-black rounded border p-1"></input>
                    <button className="border bg-black text-white w-24 rounded p-1">Register</button>
                    <p>
                       Already have a account 
                        <Link to={'/login'} className="pl-1 font-bold underline">
                            Login?
                        </Link> 
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register