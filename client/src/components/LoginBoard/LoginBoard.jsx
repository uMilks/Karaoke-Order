import { useState } from "react"

const API_URL = process.env.REACT_APP_API_URL

export default function LoginBoard({ switchState, navigate_to_session, session }) {
    const [loginData, setLoginData] = useState({username: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState("");

    const handleName = (e) => {
        const newLoginData = loginData
        newLoginData.username = e.target.value
        setLoginData(newLoginData)
    }

    const handlePassword = (e) => {
        const newLoginData = loginData
        newLoginData.password = e.target.value
        setLoginData(newLoginData)
    }

    const checkValidity = async () => {
        if (loginData.username == "" || loginData.password == "") {
            setWarning("Nome e senha não podem ser vazios.")
        } else {
            setWarning("")
            setLoading(true);
            let data_register = await fetch(`${API_URL}/user-login?username=${loginData.username}&password=${loginData.password}&session=${session}`)
            const serverResponse = await data_register.json();
            if (serverResponse.token) {
                localStorage.setItem("TOKEN", JSON.stringify(serverResponse.token));
                navigate_to_session(serverResponse.token, session)
            } else {
                setWarning("Usuário ou senha incorretos.")
                setLoading(false);
            }
        }
    }

    return(
        <>
            <h1>Faça login</h1>
            <div className="login-board">
                <div>
                    <label style={{color: "black"}}>Nome de usuário:</label> <input type="text" className="login-bar" id="login-username" placeholder="Ex: Luke Harry Draco" onBlur={handleName}></input>
                </div>

                <div>
                    <label style={{color: "black"}}>Senha:</label> <input type="password" className="login-bar" id="login-password" placeholder="Ex: SolLua1234" onBlur={handlePassword}></input>
                </div>

                <p style={{color: 'red'}}>{warning}</p>

                <div className="confirm-area">
                    <button onClick={checkValidity} style={{width:"100%"}}>Confirmar</button>
                    {loading ? <div className="loader"></div> : null}
                </div>

                <a className="login-create-link" onClick={switchState}><u>Não tem uma conta? Clique aqui para criar.</u></a>
            </div>
        </>
    )
}