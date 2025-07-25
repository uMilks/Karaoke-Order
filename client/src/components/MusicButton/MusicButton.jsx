

export default function MusicButton({videoData, estimatedTime}) {


    return (
        <div className="music">
            <p className="music-text">{videoData.index} - {videoData.title}</p>
            <p className="music-text">° Cantor(a): {videoData.singer}</p>
            <p>° Estimativa de demora: {estimatedTime}</p>
        </div>
    )
}