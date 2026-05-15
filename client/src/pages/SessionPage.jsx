import CurrentMusic from "../components/CurrentMusic/CurrentMusic"
import AddMusic from "../components/AddMusic/AddMusic"
import RemoveMusic from "../components/RemoveMusic/RemoveMusic"
import SwitchMusic from "../components/SwitchMusic/SwitchMusic"
import AddSinger from "../components/AddSinger/AddSinger"
import RemoveSinger from "../components/RemoveSinger/RemoveSinger"
import SetPassword from "../components/SetPassword/SetPassword"
import MusicButton from "../components/MusicButton/MusicButton"
import FooterBar from "../components/FooterBar/FooterBar"
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL

export default function SessionPage() {
    const [apiKey, setApiKey] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const session_name = searchParams.get("name");
    const navigate = useNavigate();
    const [musics, setMusics] = useState([])
    const [singers, setSingers] = useState([])
    const [addSinger, setAddSinger] = useState(false)
    const [removeSinger, setRemoveSinger] = useState(false)
    const [addMusic, setAddMusic] = useState(false)
    const [removeMusic, setRemoveMusic] = useState(false)
    const [switchMusic, setSwitchMusic] = useState(false)
    const [settingPassword, setSettingPassword] = useState(false)
    const [sidePanel, setSidePanel] = useState(false)
    const [singerList, setSingerList] = useState(false)
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 1000px)").matches
    )
    const [update, setUpdate] = useState(true)
    const [TOKEN, setTOKEN] = useState();

    useEffect(() => {
        let newToken = JSON.parse(localStorage.getItem("TOKEN"))
        setTOKEN(newToken);
        if (!newToken) {
            navigate(`/login?redirect=${session_name}`);
        } else if (newToken.logged_into.indexOf(session_name) == -1) {
            navigate(`/login?redirect=${session_name}`);
        }
    }, [])

    useEffect(() => {
        window
        .matchMedia("(min-width: 1000px)")
        .addEventListener('change', e => setMatches( e.matches ));
        async function fetchKeys() {
            const key_data = await fetch(`${API_URL}/keys`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const keys = await key_data.json()
            setApiKey(keys.apiKey)
        }
        fetchKeys()
        checkSession()
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => {
            setUpdate(true);
        }, 10000);
        if (update) {
            checkSession()
            setUpdate(false)
        }

        return () => clearTimeout(timer)
    }, [update]);

    const checkSession = async () => {
        try {
            const fetch_data = await fetch(`${API_URL}/session?name=${session_name}`)
            const server_response = await fetch_data.json()
            if (!server_response.session) {
                // Se a sessão não existir, server_response.session será null
                navigate("/")
            } else {
                setMusics(server_response.session.musics)
                setSingers(server_response.session.singers)
                let newToken = JSON.parse(localStorage.getItem("TOKEN"));
                if (!server_response.session.singers.includes(newToken.username) && newToken.logged_into.includes(session_name)) {
                    console.log("Inserindo cantor: ", newToken.username)
                    await updateSingers(newToken.username);
                }
            }

        } catch (e) {
            console.error(e)
            navigate("/")
        }
    }

    const updateSingers = async (data) => {
        try {
            const session_data = {name: session_name, singer: data}
            const json_data = JSON.stringify(session_data)
            const fetch_data = await fetch(`${API_URL}/add-singer`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: json_data,
            })
            const server_response = await fetch_data.json()
            if (server_response.msg == "Sucesso ao adicionar cantor.") {
                setSingers([...singers, data])
            }
            return server_response.msg
        } catch (e) {
            console.error(e)
        }
    }

    const updateMusics = async (data) => {
        try {
            const session_data = {name: session_name, music: data}
            const json_data = JSON.stringify(session_data)
            const fetch_data = await fetch(`${API_URL}/add-music`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: json_data,
            })
            const server_response = await fetch_data.json()
            if (server_response.msg != "Sucesso ao adicionar música.") {
                throw new Error(server_response.msg)
            }
            setMusics([...musics, data])
            setAddMusic(false)
            setRemoveMusic(false)
        } catch (e) {
            console.error(e)
        }
    }
    const removeMusicByIndex = async (i, username, admin) => {
        try {
            let music = musics[i]
            let newMusics = musics.filter((value) => value != music)
            const session_data = {name: session_name, index: i, username: username, admin: admin}
            const json_data = JSON.stringify(session_data)
            const fetch_data = await fetch(`${API_URL}/remove-music`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: json_data,
            })
            const server_response = await fetch_data.json()
            if (server_response.msg == "Sucesso ao remover música.") {
                setMusics(newMusics)
            }
            return server_response.msg
        } catch (e) {
            console.error(e)
        }
        
    }

    const removeSingerbyName = async (singer) => {
        try {
            let newSingers = singers.filter((value) => value != singer)
            let newMusics = musics.filter((value) => value.singer != singer)
            const session_data = {name: session_name, singer: singer}
            const json_data = JSON.stringify(session_data)
            const fetch_data = await fetch(`${API_URL}/remove-singer`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: json_data,
            })
            const server_response = await fetch_data.json()
            if (server_response.msg == "Sucesso ao remover cantor.") {
                setSingers(newSingers)
                setMusics(newMusics)
            }
            return server_response.msg
        } catch (e) {
            console.error(e)
        }
        
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

    const switchMusicOrder = async (x, y) => {
        try {
            let newMusics = musics.map((value)=>{return value})
            let temp = newMusics[x]
            newMusics[x] = newMusics[y]
            newMusics[y] = temp
            const data = {name: session_name, x: x, y: y, password: adminKey}
            const json_data = JSON.stringify(data)
            const fetch_data = await fetch(`${API_URL}/switch-order`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: json_data,
            })
            const server_response = await fetch_data.json()
            if (server_response.msg == "Sucesso ao alterar ordem.") {
                setMusics(newMusics)
            }
            return server_response.msg
        } catch (e) {
            console.error(e)
        }
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

    const logOut = async () => {
        removeSingerbyName(TOKEN.username);
        const fetch_data = await fetch(`${API_URL}/user-logout?username=${TOKEN.username}&session=${session_name}`, {
            method: 'PATCH'
        });
        const server_response = await fetch_data.json();
        if (server_response.msg == "Deslogando...") {
            console.log("AA")
            let newToken = JSON.stringify(server_response.token);
            console.log(server_response.token, newToken)
            setTOKEN(newToken);
            localStorage.setItem("TOKEN", newToken);
        }
        navigate(`/login?redirect=${session_name}`);
    }

    return (
        <>
            {addMusic ? <AddMusic apiKey={apiKey} setMusic={updateMusics} removeSelf={() => setAddMusic(false)} singerList={singers} singerCheck={checkSingerHasMusic} token={TOKEN} /> : null}
            {removeMusic ? <RemoveMusic musicsLength={musics.length} removeMusic={removeMusicByIndex} removeSelf={() => setRemoveMusic(false)} token={TOKEN} /> : null}
            {switchMusic ? <SwitchMusic musicsLength={musics.length} switchMusic={switchMusicOrder} removeSelf={() => setSwitchMusic(false)} token={TOKEN} /> : null}
            <nav>
                <div className="logo" onClick={() => {navigate("/")}}>
                    <img src="../assets/mic.ico" className="icon"></img>
                    <p>Karaoke Order</p>
                </div>
                <div className="nav-buttons">
                    {matches ? 
                        (<>
                        <button onClick={() => setAddMusic(!addMusic)} className="add-music-button">Adicionar Música</button>
                        <button onClick={() => setRemoveMusic(!removeMusic)} className="remove-music-button">Remover Música</button>
                        <button onClick={() => setSwitchMusic(!switchMusic)} className="switch-music-button">Alterar Ordem</button>
                        <button onClick={logOut} className="switch-music-button">Logout</button>
                        </>)
                        : <button className="options-button" onClick={() => {setSidePanel(!sidePanel); setSingerList(false)}}>…</button>
                    }
                </div>
            </nav>
            <main className="session-page">
                {matches ? 
                    <div className="singers-list">
                        <h2>° Lista de Cantores</h2>
                        <div>
                            {createSingerList()}
                        </div>
                    </div>
                : null}
                <CurrentMusic videoData={musics[0] ? musics[0] : {}} removeMusic={() => removeMusicByIndex(0, TOKEN.username, TOKEN.admin)}></CurrentMusic>
                <div className="music-list">
                    {createMusicList()}
                </div>
                {!matches && sidePanel ? <> <div onClick={() => {setSidePanel(false); setSingerList(false)}} className="side-panel-background"></div> <div className="side-panel">
                    <a className="side-panel-button" onClick={() => {setAddMusic(!addMusic); setSidePanel(false)}}>Adicionar Música</a>
                    <hr></hr>
                    <a className="side-panel-button" onClick={() => {setRemoveMusic(!removeMusic); setSidePanel(false)}}>Remover Música</a>
                    <hr></hr>
                    <a className="side-panel-button" onClick={() => {setSwitchMusic(!switchMusic); setSidePanel(false)}}>Alterar Ordem</a>
                    <hr></hr>
                    <a className="side-panel-button" onClick={() => {setSingerList(true)}}>Lista de Cantores</a>
                    <hr></hr>
                    <a className="side-panel-button" onClick={logOut}>Logout</a>
                </div> </> : null}
                {!matches && singerList ? <>
                    <div className="side-panel">
                        <h2>° Lista de Cantores</h2>
                        <div className="side-singers-list">
                            {createSingerList()}
                        </div>
                    </div>
                </>: null}
                <FooterBar/>
            </main>
        </>
    )
}