import { useState } from "react"

export default function AddSinger({singerList, setSinger, removeSelf}) {
    const [singerName, setSingerName] = useState('')
    const [warning, setWarning] = useState('')

    const handleOnBlur = (e) => {
        const newName = e.target.value
        setSingerName(newName)
    }

    const checkSinger = () => {
        if (singerName) {
            if (!singerList.includes(singerName)) {
                setSinger(singerName)
            } else {
                setWarning('Já existe um Cantor com esse nome.')
            }
        } else {
            setWarning('Insira um Cantor.')
        }
    }

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update"></div>
            <div className="add-singer">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Nome do Cantor:</label>
                <input onBlur={handleOnBlur} className="search-bar"></input>
                <p style={{color: 'red'}}>{warning}</p>
                <button onClick={checkSinger}>Enviar</button>
            </div>
        </div>
    );
}