import { useState } from "react"

export default function SwitchMusic({musicsLength, switchMusic, removeSelf}) {
    const [musicIndexes, setMusicIndexes] = useState([null, null])
    const [warning, setWarning] = useState('')

    const handleIndexOne = (e) => {
        const newIndex = e.target.value
        let newIndexes = musicIndexes.map((value)=>{return value})
        newIndexes[0] = newIndex
        setMusicIndexes(newIndexes)
    }

    const handleIndexTwo = (e) => {
        const newIndex = e.target.value
        let newIndexes = musicIndexes.map((value)=>{return value})
        newIndexes[1] = newIndex
        setMusicIndexes(newIndexes)
    }

    const checkMusic = () => {
        try {
            let newIndexOne = parseInt(musicIndexes[0])
            let newIndexTwo = parseInt(musicIndexes[1])
            if ((newIndexOne > musicsLength || newIndexOne < 1 || isNaN(newIndexOne)) || (newIndexTwo > musicsLength || newIndexTwo < 1 || isNaN(newIndexTwo))) {
                throw RangeError
            }
            switchMusic(newIndexOne-1, newIndexTwo-1)
            removeSelf()
        } catch (error) {
            console.error(error)
            setWarning('Insira números válidos.')
        }
    }

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update"></div>
            <div className="switch-music">
                <button onClick={removeSelf} className="x-button">X</button>
                <br></br>
                <label>Insira o número da primeira música:</label>
                <input onBlur={handleIndexOne} className="search-bar"></input>
                <br></br><br></br>
                <label>Insira o número da segunda música:</label>
                <input onBlur={handleIndexTwo} className="search-bar"></input>
                <p style={{color: 'red'}}>{warning}</p>
                <button onClick={checkMusic}>Enviar</button>
            </div>
        </div>
    );
}