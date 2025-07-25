

export default function CurrentMusic({videoData, removeMusic}) {
    // <img src={videoData.thumbnail ? videoData.thumbnail : videoPlaceholder} className="thumbnail"></img>
    return (
        <div className="current-music">
            <p>Nome do vídeo: {videoData.title ? videoData.title : 'Vídeo desconhecido'}</p>
            <iframe className='video'
                title='Youtube player'
                sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                src={`https://youtube.com/embed/${videoData.id ? videoData.id : ''}?autoplay=0`}>
            </iframe>
            <br></br> <br></br>
            <p>Link do vídeo: {videoData.id ? <a href={`https://youtube.com/watch?v=${videoData.id}`} target="_blank">{`https://youtube.com/${videoData.id}`}</a> : 'Desconhecido'}</p>
            <hr className="separator"></hr>
            <p>Duração: {videoData.duration ? videoData.duration : '-:--'}</p>
            <p>Cantor: {videoData.singer ? videoData.singer : 'Desconhecido'}</p>
            <button onClick={removeMusic}>Remover Música Atual</button>
        </div>
    )
}