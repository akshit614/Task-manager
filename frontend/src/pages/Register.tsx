import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"


const Register = () => {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleOnclick = async() => {

        try {
            await axios.post(`${BASE_URL}/auth/register`,{
                email,
                name,
                password
            })
            alert("Registration success")  
            navigate('/login')         
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
                    <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Username" className="rounded border-black border p-1"></input>
                    <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border-black rounded border p-1"></input>
                    <button onClick={handleOnclick} className="border bg-black text-white w-24 rounded p-1">Register</button>
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