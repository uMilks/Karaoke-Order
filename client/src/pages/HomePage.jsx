import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const [creatingSession, setCreatingSession] = useState(false)
    const [enteringSession, setEnteringSession] = useState(true)
    const [password, setPassword] = useState('')
    const [session, setSession] = useState('')
    const [warning, setWarning] = useState('')
    const [warningColor, setWarningColor] = useState('red')
    const navigate = useNavigate();

    const enterSession = async () => {
        const data = {name: session}
        const json_data = JSON.stringify(data)
        const fetch_data = await fetch(`https://karaoke-order-server.onrender.com/session?name=${session}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const server_response = await fetch_data.json()
        if (server_response.status == 200) {
            navigate(`/session?name=${session}`)
        } else {
            setWarningColor('red')
            setWarning('Esta sessão não existe.')
        }
    }

    const createSession = async () => {
        const data = {name: session, password: password}
        const json_data = JSON.stringify(data)
        const fetch_data = await fetch("https://karaoke-order-server.onrender.com/create-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json_data,
        })
        const server_response = await fetch_data.json()
        if (server_response.msg == 'Sucesso ao criar sessão!') {
            setWarningColor('green')
        } else {
            setWarningColor('red')
        }
        setWarning(server_response.msg)
    }

    const enterSessionDiv = () => {
        return (
            <div className="enter-session">
                <label>Insira o nome da sessão que deseja entrar: </label>
                <input type="text" className="search-bar" defaultValue={session} onBlur={(e)=>{setSession(e.target.value)}}></input>
                <p style={{color: warningColor}}>{warning}</p>
                <br></br>
                <button onClick={enterSession}>Confirmar</button>
            </div>
        )
    }

    const createSessionDiv = () => {
        return(
            <div className="enter-session">
                <label>Insira a senha de admin: </label>
                <input type="text" className="search-bar" defaultValue={password} onBlur={(e)=>{setPassword(e.target.value)}}></input>
                <br></br>
                <br></br>
                <label>Insira o nome da sessão que deseja criar: </label>
                <input type="text" className="search-bar" defaultValue={session} onBlur={(e)=>{setSession(e.target.value)}}></input>
                <p style={{color: warningColor}}>{warning}</p>
                <br></br>
                <button onClick={createSession}>Confirmar</button>
            </div>
        )
    }

    return (
        <div style={{height: '100vh'}}>
            <nav>
                <div className="logo">
                    <img src="../assets/mic.ico" className="icon"></img>
                    <p>Karaoke Order</p>
                </div>
            </nav>
            <main className="home-page">
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button className="session-button" onClick={()=>{setCreatingSession(true); setEnteringSession(false); setWarning('')}}>Criar Sessão</button>
                    <button className="session-button" onClick={()=>{setCreatingSession(false); setEnteringSession(true); setWarning('')}}>Entrar em Sessão</button>
                </div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    {creatingSession ? createSessionDiv() : null}
                    {enteringSession ? enterSessionDiv() : null}
                </div>
            </main>
            <footer></footer>
        </div>
    )
}