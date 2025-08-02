import { useState } from "react"

export default function SetPassword({sendPassword, removeSelf}) {
    const [password, setPassword] = useState('')

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update" onClick={removeSelf}></div>
            <div className="remove-singer">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Insira a senha de admin: </label>
                <input type="text" className="search-bar" onBlur={(e)=>{setPassword(e.target.value)}}></input>
                <br/><br/>
                <button onClick={() => {sendPassword(password); removeSelf()}}>Enviar</button>
            </div>
        </div>
    );
}