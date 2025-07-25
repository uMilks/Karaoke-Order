import { useState } from "react"

export default function RemoveSinger({singerList, removeSinger, removeSelf}) {
    const [singerName, setSingerName] = useState('')
    const [warning, setWarning] = useState('')

    const handleOnBlur = (e) => {
        const newName = e.target.value
        if (newName) {setSingerName(newName)}
    }

    const checkSinger = () => {
        if (singerName) {
            removeSinger(singerName)
            removeSelf()
        } else {
            setWarning('Insira um Cantor.')
        }
    }

    const createOptions = () => {
        let optionList = [<option value={''} key=''></option>]
        for (let i=0; i < singerList.length; i++) {
            optionList.push(<option value={singerList[i]} key={singerList[i]}>{singerList[i]}</option>)
        }
        return optionList
    }

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update"></div>
            <div className="remove-singer">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Nome do Cantor:</label>
                <select id="singers" onBlur={handleOnBlur}>
                    {createOptions()}
                </select>
                <p style={{color: 'red'}}>{warning}</p>
                <button onClick={checkSinger}>Enviar</button>
            </div>
        </div>
    );
}