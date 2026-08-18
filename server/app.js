import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { 
    getAllSessions,
    addSession,
    findSessionByName,
    updateSession,
    addUser,
    findUserByName,
    updateUser
 } from "./db.js";

var app = express()
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
const adminKey = process.env.ADMIN_KEY;
//const CORS_ORIGINS = process.env.CORS_ORIGINS.split(',');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.static('public'))
app.use(cors())

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
        res.status(409).send({msg: 'Sessão já existe.'})
    } else {
        try {
            await addSession({name: name, musics: [], singers: []})
            res.status(200).send({msg: 'Sucesso ao criar sessão!'})
        } catch (e) {
            res.status(500).send({msg: 'Erro ao criar sessão.'})
        }
    }
})

app.post("/create-account", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const logged_into = req.body.logged_into
    let user_exists = await findUserByName(username) ? true : false
    if (user_exists){
        res.status(409).send({msg: 'Usuário já existe.'})
    } else {
        try {
            await addUser({username: username, password: password, admin: false, logged_into: logged_into})
            res.status(200).send({msg: 'Sucesso ao criar usuário!', token: {username:username, admin: false, logged_into: logged_into}})
        } catch (e) {
            res.status(500).send({msg: 'Erro ao criar usuário.'})
        }
    }
})

app.get("/user-login", async function (req, res) {
    const username = req.query.username;
    const password = req.query.password
    const session = req.query.session
    const user = await findUserByName(username);
    if (user) {
        if (user.password != password) {
            res.status(401).send({msg: 'Senha incorreta.'})
        } else {
            let newUserData = user
            if (user.logged_into.indexOf(session) == -1) {
                newUserData.logged_into.push(session)
                await updateUser(username, newUserData)
            }
            console.log(`Usuário ${username} logando...`)
            res.status(200).send({msg: 'Fazendo login...', token: {username: username, admin: user.admin, logged_into: newUserData.logged_into}});
        }
    } else {
        res.status(404).send({msg: 'Usuário não encontrado.'})
    }
})

app.patch("/user-logout", async function (req, res) {
    const username = req.query.username;
    const session = req.query.session;
    const user = await findUserByName(username);
    if (user) {
        let newUserData = user;
        let session_index = user.logged_into.indexOf(session);
        if (session_index > -1) {
            newUserData.logged_into.splice(session_index, 1)
            await updateUser(username, newUserData)
            console.log(`Usuário ${username} deslogando da sessão ${session}...`)
            console.log(newUserData.logged_into)
            res.status(200).send({msg: 'Deslogando...', token: {username: username, admin: user.admin, logged_into: newUserData.logged_into}});
        } else {
            res.status(404).send({msg: 'Usuário não estava logado nesta sessão.'})
        }
    } else {
        res.status(404).send({msg: 'Usuário não encontrado.'})
    }
})

app.get("/keys", function(req, res) {
    res.status(200).send({apiKey: apiKey, adminKey: adminKey})
})

app.post("/add-singer", async function(req, res) {
    const data = {name: req.body.name, singer: req.body.singer}
        let session = await findSessionByName(data.name)
    if (session) {
        if (session.singers.includes(data.singer)) {
            res.status(409).send({msg: "Cantor já existe."});
        } else {
            session.singers.push(data.singer)
            try {
                await updateSession(session.name, session)
                res.status(200).send({msg: 'Sucesso ao adicionar cantor.'})
            } catch (e) {
                console.error("Erro ao adicionar cantor na sessão: " + data.name)
                res.status(500).send({msg: "Erro ao adicionar cantor."})
            }
        }
    } else {
        res.status(404).send({msg: 'Sessão não existe.'})
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
    } catch (e) {
        res.status(500).send({msg: 'Erro ao remover cantor.'})
    }
})

app.delete("/remove-music", async function(req, res) {
    try {
        const target_name = req.body.name
        const target_index = req.body.index
        const username = req.body.username
        const admin = req.body.admin
        const target_session = await findSessionByName(target_name)
        if (target_session) {
            let target_music = target_session.musics[target_index]
            if (!admin && target_music.singer != username) {
                res.status(405).send({msg: "Música não pertence ao usuário logado."})
                console.error(`Música não pertence ao usuário logado ${target_music.singer}, mas sim ao usuário ${username}.`)
            } else {
                let new_musics = target_session.musics.filter((value) => value != target_music)
                target_session.musics = new_musics
                await updateSession(target_session.name, target_session)
                res.status(200).send({msg: 'Sucesso ao remover música.'})
            }
        } else {
            res.status(404).send({msg: 'Sessão não existe.'})
        }
    } catch (e) {
        res.status(500).send({msg: 'Erro ao remover música.'})
    }
})

app.patch("/switch-order", async function(req, res) {
    try {
        const admin = req.body.admin
        if (!admin) {
            res.status(405).send({msg: "Usuário não é admin."})
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