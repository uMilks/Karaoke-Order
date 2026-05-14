import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FooterBar from "../components/FooterBar/FooterBar"

const API_URL = process.env.REACT_APP_API_URL

export default function LoginPage(session_name) {
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem("TOKEN")
    useEffect(()=>{
        if (TOKEN) {
            navigate(`/session/?name=${session_name}`)
        }
    }, [TOKEN])

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
                <FooterBar/>
            </main>
        </div>
    )
}