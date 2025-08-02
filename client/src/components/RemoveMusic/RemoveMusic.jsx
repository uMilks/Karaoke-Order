import { useState } from "react"

export default function RemoveMusic({musicsLength, removeMusic, removeSelf}) {
    const [musicIndex, setMusicIndex] = useState('')
    const [warning, setWarning] = useState('')

    const handleOnBlur = (e) => {
        const newIndex = e.target.value
        setMusicIndex(newIndex)
    }

    const checkMusic = async () => {
        try {
            let newIndex = parseInt(musicIndex)
            if (newIndex > musicsLength || newIndex < 1 || isNaN(newIndex)) {
                throw RangeError
            }
            const result = await removeMusic(newIndex-1)
            result == "Sucesso ao remover música." ? removeSelf() : setWarning(result)
        } catch (error) {
            setWarning('Insira um número válido.')
        }
    }

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update" onClick={removeSelf}></div>
            <div className="remove-singer">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Insira o número da música:</label>
                <input onBlur={handleOnBlur} className="search-bar"></input>
                <p style={{color: 'red'}}>{warning}</p>
                <button onClick={checkMusic}>Enviar</button>
            </div>
        </div>
    );
}