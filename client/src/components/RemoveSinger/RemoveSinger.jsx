import { useState } from "react"

export default function RemoveSinger({singerList, removeSinger, removeSelf}) {
    const [singerName, setSingerName] = useState('')
    const [warning, setWarning] = useState('')

    const handleOnBlur = (e) => {
        const newName = e.target.value
        if (newName) {setSingerName(newName)}
    }

    const checkSinger = async () => {
        if (!singerName) {
            setWarning('Insira um Cantor.')
        } else {
            const result = await removeSinger(singerName)
            result == "Sucesso ao remover cantor." ? removeSelf() : setWarning(result)
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
            <div className="dark-translucid-background background-update" onClick={removeSelf}></div>
            <div className="remove-singer">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Nome do Cantor: </label>
                <select id="singers" onBlur={handleOnBlur}>
                    {createOptions()}
                </select>
                <br/> <br/>
                <button onClick={checkSinger}>Enviar</button>
            </div>
        </div>
    );
}