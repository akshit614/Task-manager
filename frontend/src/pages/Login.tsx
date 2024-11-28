import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import axios from "axios"


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleOnclick = async() => {

        try {
            const res = await axios.post(`${BASE_URL}/auth/login`,{
                email,
                password
            })
            const data = await res.data
            const token : string = data.token

            localStorage.setItem("token", token)
            
            alert("login success")  
            navigate('/tasks')         
        } catch (error) {
            alert("error in registering user " + error)
        }
        
    }

  return (
    <div className="flex justify-center">
        <div className="h-screen flex flex-col justify-center">
            <div className="shadow-md p-5 rounded-lg">
                <p className="font-bold text-2xl text-gray-700">
                    Welcome to  To-Do app
                </p>
                <div className="flex flex-col justify-center p-5 gap-3 items-center">
                    <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded border-black border p-1"></input>
                    <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border-black rounded border p-1"></input>
                    <button onClick={handleOnclick} className="border bg-black text-white w-24 rounded p-1">Login</button>
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