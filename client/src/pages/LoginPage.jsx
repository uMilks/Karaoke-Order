import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import LoginBoard from "../components/LoginBoard/LoginBoard"
import CreateAccountBoard from "../components/CreateAccountBoard/CreateAccountBoard"
import FooterBar from "../components/FooterBar/FooterBar"

export default function LoginPage() {
    const navigate = useNavigate();
    const [logging, setLogging] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const session_name = searchParams.get("redirect");
    const TOKEN = JSON.parse(localStorage.getItem("TOKEN"));

    const navigate_login = (token, session) => {
        if (token) {
            if (session != "") {
                if (token.logged_into.indexOf(session_name) > -1) {
                    navigate(`/session/?name=${session}`);
                }
            } else {
                navigate("/");
            }
        }
    }

    useEffect(()=>{
        navigate_login(TOKEN, session_name);
    }, [])

    return (
        <div style={{height: '100vh'}}>
            <nav>
                <div className="logo" onClick={() => {navigate("/")}}>
                    <img src="../assets/mic.ico" className="icon"></img>
                    <p>Karaoke Order</p>
                </div>
            </nav>
            <main className="login-page">
                {logging ? 
                <LoginBoard switchState={()=>{setLogging(false)}} navigate_to_session={navigate_login} session={session_name} />
                : 
                <CreateAccountBoard switchState={()=>{setLogging(true)}} navigate_to_session={navigate_login} session={session_name} />}
                <FooterBar/>
            </main>
        </div>
    )
}