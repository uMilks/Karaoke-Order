import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { 
    getAllSessions,
    addSession,
    findSessionByName,
    updateSession
 } from "./db.js";

var app = express()
const PORT = 8080;
const apiKey = process.env.API_KEY
const adminKey = process.env.ADMIN_KEY

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.static('public'))
app.use(cors({
    origin: ['https://karaoke-order.onrender.com']
}))

//TODO: Criar um delete para deletar sessões pelo site (não sei se é necessário)

app.get("/check-session", async function (req, res) {
    const name = req.query.name;
    const session = await findSessionByName(name);
    res.status(session ? 200 : 404).send({session_exists: session ? true : false});
})

app.get("/session", async function (req, res) {
    const name = req.query.name;
    const session = await findSessionByName(name);
    res.status(session ? 200 : 404).send({session: session});
})

app.post("/create-session", async function(req, res) {
    const name = req.body.name;
    const password = req.body.password;
    let session_exists = await findSessionByName(name) ? true : false
    if (password != adminKey) {
        res.status(405).send({msg: 'Senha incorreta.'})
    } else if (session_exists){
        // TODO: Pesquisar qual o status correto para enviar
        res.status(400).send({msg: 'Sessão já existe.'})
    } else {
        try {
            await addSession({name: name, musics: [], singers: []})
            res.status(200).send({msg: 'Sucesso ao criar sessão!'})
        } catch (e) {
            res.status(500).send({msg: 'Erro ao criar sessão.'})
        }
    }
})

app.get("/keys", function(req, res) {
    res.status(200).send({apiKey: apiKey, adminKey: adminKey})
})

app.post("/add-singer", async function(req, res) {
    const data = {name: req.body.name, singer: req.body.singer, password: req.body.password}
    if (data.password != adminKey) {
        res.status(405).send({msg:"Senha incorreta."})
    } else {
        let session = await findSessionByName(data.name)
    if (session) {
        session.singers.push(data.singer)
        try {
            await updateSession(session.name, session)
            res.status(200).send({msg: 'Sucesso ao adicionar cantor.'})
        } catch (e) {
            console.error("Erro ao adicionar cantor na sessão: " + data.name)
            res.status(500).send({msg: "Erro ao adicionar cantor."})
        }
    } else {
        res.status(404).send({msg: 'Sessão não existe.'})
    }
    }
})

app.post("/add-music", async function(req, res) {
    const data = {name: req.body.name, music: req.body.music}
    let session = await findSessionByName(data.name)
    if (session) {
        session.musics.push(data.music)
        try {
            await updateSession(session.name, session)
            res.status(200).send({msg: 'Sucesso ao adicionar música.'})
        } catch (e) {
            console.error("Erro ao adicionar música na sessão: " + data.name)
            res.status(500).send({msg: "Erro ao adicionar música."})
        }
    } else {
        res.status(404).send({msg: 'Sessão não existe.'})
    }
})

app.delete("/remove-singer", async function(req, res) {
    try {
        const target_name = req.body.name
        const target_singer = req.body.singer
        const password = req.body.password
        if (password != adminKey) {
            res.status(405).send({msg: 'Senha incorreta.'})
        } else {
            const target_session = await findSessionByName(target_name)
            if (target_session) {
                let new_singers = target_session.singers.filter((value) => value != target_singer)
                target_session.singers = new_singers
                let new_musics = target_session.musics.filter((value) => value.singer != target_singer)
                target_session.musics = new_musics
                await updateSession(target_session.name, target_session)
                res.status(200).send({msg: 'Sucesso ao remover cantor.'})
            } else {
                res.status(404).send({msg: 'Sessão não existe.'})
            }
        }
    } catch (e) {
        res.status(500).send({msg: 'Erro ao remover cantor.'})
    }
})

app.delete("/remove-music", async function(req, res) {
    try {
        const target_name = req.body.name
        const target_index = req.body.index
        const password = req.body.password
        if (password != adminKey) {
            // TODO: Pesquisar o código certo para enviar
            res.status(405).send({msg: "Senha incorreta."})
        }
        const target_session = await findSessionByName(target_name)
        if (target_session) {
            let target_music = target_session.musics[target_index]
            let new_musics = target_session.musics.filter((value) => value != target_music)
            target_session.musics = new_musics
            await updateSession(target_session.name, target_session)
            res.status(200).send({msg: 'Sucesso ao remover música.'})
        } else {
            res.status(404).send({msg: 'Sessão não existe.'})
        }
    } catch (e) {
        res.status(500).send({msg: 'Erro ao remover música.'})
    }
})

app.patch("/switch-order", async function(req, res) {
    try {
        const password = req.body.password
        if (password != adminKey) {
            res.status(400).send({msg: "Senha incorreta."})
        } else {
            const target_name = req.body.name
            const x = req.body.x
            const y = req.body.y
            const target_session = await findSessionByName(target_name)
            if (target_session) {
                let new_musics = target_session.musics.map((value)=>{return value})
                let temp = new_musics[x]
                new_musics[x] = new_musics[y]
                new_musics[y] = temp
                target_session.musics = new_musics
                await updateSession(target_session.name, target_session)
                res.status(200).send({msg: 'Sucesso ao alterar ordem.'})
            } else {
                res.status(404).send({msg: 'Sessão não existe.'})
            }
        }
    } catch (e) {
        res.status(500).send({msg: 'Erro ao alterar ordem.'})
    }
})

app.listen(PORT, ()=>{
    console.log('Ouvindo na porta', PORT)
});