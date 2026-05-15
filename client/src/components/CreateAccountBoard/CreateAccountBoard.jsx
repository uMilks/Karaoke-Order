import { useState } from "react"

const API_URL = process.env.REACT_APP_API_URL

export default function CreateAccountBoard({ switchState, navigate_to_session, session }) {
    const [createAccountData, setCreateAccountData] = useState({name: "", password: "", logged_into: [session]});
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState("");

    const handleName = (e) => {
        const newCreateAccountData = createAccountData
        newCreateAccountData.username = e.target.value
        setCreateAccountData(newCreateAccountData)
    }

    const handlePassword = (e) => {
        const newCreateAccountData = createAccountData
        newCreateAccountData.password = e.target.value
        setCreateAccountData(newCreateAccountData)
    }

    const checkValidity = async () => {
        if (createAccountData.username == "" || createAccountData.password == "") {
            setWarning("Nome e senha não podem ser vazios.")
        } else {
            setWarning("");
            setLoading(true);
            let data_register = await fetch(`${API_URL}/create-account`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(createAccountData)
            })
            const serverResponse = await data_register.json();
            if (serverResponse.token) {
                localStorage.setItem("TOKEN", serverResponse.token)
                navigate_to_session(serverResponse.token, session)
            } else if (serverResponse.status == 409){
                setWarning("Usuário já existe.");
                setLoading(false);
            } else {
                setWarning("Erro ao criar conta.");
                setLoading(false);
            }
        }
    }

    return(
        <>
            <h1>Crie sua conta</h1>
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

                <a className="login-create-link" onClick={switchState}><u>Já tem uma conta? Clique aqui para entrar.</u></a>
            </div>
        </>
    )
}