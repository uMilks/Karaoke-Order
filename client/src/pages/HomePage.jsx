import CurrentMusic from "../components/CurrentMusic/CurrentMusic"
import AddMusic from "../components/AddMusic/AddMusic"
import RemoveMusic from "../components/RemoveMusic/RemoveMusic"
import SwitchMusic from "../components/SwitchMusic/SwitchMusic"
import AddSinger from "../components/AddSinger/AddSinger"
import RemoveSinger from "../components/RemoveSinger/RemoveSinger"
import MusicButton from "../components/MusicButton/MusicButton"
import { useState } from "react"

export default function HomePage() {
    const apiKey = process.env.REACT_APP_API_KEY
    const [musics, setMusics] = useState([])
    const [singers, setSingers] = useState([])
    const [addSinger, setAddSinger] = useState(false)
    const [removeSinger, setRemoveSinger] = useState(false)
    const [addMusic, setAddMusic] = useState(false)
    const [removeMusic, setRemoveMusic] = useState(false)
    const [switchMusic, setSwitchMusic] = useState(false)

    const updateSingers = (data) => {
        setSingers([...singers, data])
        setAddSinger(false)
    }

    const updateMusics = (data) => {
        setMusics([...musics, data])
        setAddMusic(false)
        setRemoveMusic(false)
    }
    const removeMusicByIndex = (i) => {
        let music = musics[i]
        let newMusics = musics.filter((value) => value != music)
        setMusics(newMusics)
    }

    const removeSingerbyName = (singer) => {
        let newSingers = singers.filter((value) => value != singer)
        setSingers(newSingers)
        let newMusics = musics.filter((value) => value.singer != singer)
        setMusics(newMusics)
    }

    const checkSingerHasMusic = (singer) => {
        let has_music = false
        for (let i = 0; i < musics.length; i++) {
            if (musics[i].singer == singer) {
                has_music = true
            }
        }
        return has_music
    }

    const estimateTimeByIndex = (index) => {
        let estimate = 0
        let minutes = 0
        let seconds = 0
        for (let i = 0; i < index; i++) {
            // Duration é uma string, então para fazer a matemática é necessário transformar em segundos
            minutes = parseInt(musics[i].duration[0] + musics[i].duration[1])
            seconds = parseInt(musics[i].duration[2] + musics[i].duration[3])
            estimate += (minutes * 60) + seconds
        }
        return String(parseInt(estimate / 60)) + ':' + String(estimate % 60)
    }

    const switchMusicOrder = (x, y) => {
        let newMusics = musics.map((value)=>{return value})
        let temp = newMusics[x]
        newMusics[x] = newMusics[y]
        newMusics[y] = temp
        setMusics(newMusics)
    }

    const createMusicList = () => {
        let musicList = []
        for (let i=1;i<musics.length;i++) {
            musicList.push(<MusicButton videoData={{...musics[i], index:i+1}} estimatedTime={estimateTimeByIndex(i)}/>)
        }
        return musicList
    }

    const createSingerList = () => {
        let singerList = []
        for (let i=0;i<singers.length;i++) {
            singerList.push(<p key={singers[i]}>- {singers[i]}</p>)
        }
        return singerList
    }

    return (
        <>
            {addMusic ? <AddMusic apiKey={apiKey} setMusic={updateMusics} removeSelf={() => setAddMusic(false)} singerList={singers} singerCheck={checkSingerHasMusic}/> : null}
            {removeMusic ? <RemoveMusic musicsLength={musics.length} removeMusic={removeMusicByIndex} removeSelf={() => setRemoveMusic(false)} /> : null}
            {switchMusic ? <SwitchMusic musicsLength={musics.length} switchMusic={switchMusicOrder} removeSelf={() => setSwitchMusic(false)} /> : null}
            {addSinger ? <AddSinger singerList={singers} setSinger={updateSingers} removeSelf={() => setAddSinger(false)}/> : null}
            {removeSinger ? <RemoveSinger singerList={singers} removeSinger={removeSingerbyName} removeSelf={() => setRemoveSinger(false)}/> : null}
            <nav>
                <div className="logo">
                    <img src="../assets/mic.ico" className="icon"></img>
                    <p>Karaoke Order</p>
                </div>
                <div className="nav-buttons">
                    <button onClick={() => setAddSinger(!addSinger)} className="add-singer-button">Adicionar Cantor</button>
                    <button onClick={() => setRemoveSinger(!removeSinger)} className="remove-singer-button">Remover Cantor</button>
                    <button onClick={() => setAddMusic(!addMusic)} className="add-music-button">Adicionar Música</button>
                    <button onClick={() => setRemoveMusic(!removeMusic)} className="remove-music-button">Remover Música</button>
                    <button onClick={() => setSwitchMusic(!switchMusic)} className="switch-music-button">Alterar Ordem</button>
                </div>
            </nav>
            <main>
                <div className="singers-list">
                    <h2>° Lista de Cantores</h2>
                    {createSingerList()}
                </div>
                <CurrentMusic videoData={musics[0] ? musics[0] : {}} removeMusic={() => removeMusicByIndex(0)}></CurrentMusic>
                <div className="music-list">
                    {createMusicList()}
                </div>
            </main>
        </>
    )
}