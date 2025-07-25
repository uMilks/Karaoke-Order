import { useState } from "react"
import { parse } from "tinyduration"

export default function AddMusic({apiKey, setMusic, removeSelf, singerList, singerCheck}) {
    const [videoName, setVideoName] = useState('')
    const [videoData, setVideoData] = useState({})
    const [warning, setWarning] = useState('')

    const handleOnBlur = (e) => {
        const newName = e.target.value
        setVideoName(newName)
    }

    const handleSearch = async () => {
        const search_data = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${videoName + 'karaoke'}&type=video&part=snippet`)
        const search = await search_data.json()
        // search_data recebe algumas informações sobre o vídeo, mas não as que precisamos
        // então é necessário fazer outro fetch com o id que pegamos de search_data
        if (search.items != []) {
            const video_data = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails,snippet&id=${search.items[0].id.videoId}`)
            const video = await video_data.json()
            // é preciso fazer o fetch com o param 'part=contentDetails,snippet', pois eles separados não possuem todas as informações que queremos
            // agora sim temos as informações que precisamos, como título, thumbnail e duração do vídeo
            if (video.items != []) {
                const chosen_video = video.items[0]
                let newDuration = parse(chosen_video.contentDetails.duration)
                // a duração vem em notação ISO8601, então é necessário usar um parse
                newDuration = `${newDuration.minutes}:${newDuration.seconds}`
                // o parse retorna um dicionario contendo os minutos e segundos, então é preciso juntá-los
                const data = {
                    ...videoData,
                    title: chosen_video.snippet.title,
                    id: chosen_video.id,
                    duration: newDuration,
                }
                setVideoData(data)
                console.log(chosen_video)
            }
        }
    }

    const createOptions = () => {
        let optionList = [<option value={''} key=''></option>]
        for (let i=0; i < singerList.length; i++) {
            optionList.push(<option value={singerList[i]} key={singerList[i]}>{singerList[i]}</option>)
        }
        return optionList
    }

    const handleSinger = (e) => {
        const singer_name = e.target.value
        if (singer_name != '') {
            const data = {...videoData, singer: singer_name}
            setVideoData(data)
        }
    }

    // Fazer com que precise colocar o cantor e usar um useState?
    const checkValidity = () => {
        if (videoData.hasOwnProperty('title')) {
            if (videoData.hasOwnProperty('singer')){
                if (!singerCheck(videoData.singer)){
                    setMusic(videoData)
                } else {
                    setWarning('Somente 1 música por cantor permitida.')
                }
            } else {
                setWarning('Selecione um cantor.')
            }
        } else {
            setWarning('Pesquise um vídeo válido.')
        }
    }

    return (
        <div className="background-update">
            <div className="dark-translucid-background background-update"></div>
            <div className="add-music">
                <button onClick={removeSelf} className="x-button">X</button>
                <p>Nome do vídeo: {videoData.title ? videoData.title : 'Vídeo desconhecido'}</p>
                <iframe className='video'
                    title='Youtube player'
                    sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                    src={`https://youtube.com/embed/${videoData.id ? videoData.id : ''}?autoplay=0`}>
                </iframe>
                <hr className="separator"></hr>
                <label>Cantor:</label> <select id="singers" onBlur={handleSinger}>
                    {createOptions()}
                </select> <br></br> <br></br>
                <label>Barra de pesquisa:</label> <input type="text" id='searchInput' onBlur={handleOnBlur} className="search-bar"/>
                <button onClick={handleSearch}>Pesquisar</button>
                <p>Duração: {videoData.duration ? videoData.duration : '-:--'}</p>
                <p style={{color: 'red'}}>{warning}</p>
                <button onClick={checkValidity}>Confirmar</button>
            </div>
        </div>
    )

}