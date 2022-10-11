const express = require('express')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const serviceAccount = require('./getpong-68dfd-firebase-adminsdk-9ovm9-d48c043e57.json')
const app = express()
const topic = 'getpong'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://getpong-68dfd.firebaseio.com',
})

// support parsing of application/json type post data
app.use(bodyParser.json())
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))

//With json in body
app.post('/score', (req, res) => {
    let data = req.body
    let message = createScoreMessage(data.setId, data.team, data.type)
    sendMessage(message)
    res.send(data)
})
app.post('/game', (req, res) => {
    let data = req.body
    let message = createGameMessage(data.gameEvent)
    sendMessage(message)
    res.send(data)
})

//With query param
app.post('/score/hometeam/add', (req, res) => {
    let message = createScoreMessage(req.query.setId, 'homeTeam', 'add')
    sendMessage(message)
    res.send('Point added to home team')
})
app.post('/score/hometeam/remove', (req, res) => {
    let message = createScoreMessage(req.query.setId, 'homeTeam', 'remove')
    sendMessage(message)
    res.send('Point removed from home team')
})
app.post('/score/awayteam/add', (req, res) => {
    let message = createScoreMessage(req.query.setId, 'awayTeam', 'add')
    sendMessage(message)
    res.send('Point added to away team')
})
app.post('/score/awayteam/remove', (req, res) => {
    let message = createScoreMessage(req.query.setId, 'awayTeam', 'remove')
    sendMessage(message)
    res.send('Point removed from away team')
})

//Post with no data
app.post('/game/add-set', (req, res) => {
    let message = createGameMessage('add')
    sendMessage(message)
    res.send('Set added')
})
app.post('/game/remove-set', (req, res) => {
    let message = createGameMessage('remove')
    sendMessage(message)
    res.send('Set removed')
})
app.post('/game/save', (req, res) => {
    let message = createGameMessage('save')
    sendMessage(message)
    res.send('Game saved')
})



function createScoreMessage(setId, team, type) {
    return {
        notification: {
            title: 'Score message',
        },
        data: {
            setId: setId,
            team: team,
            type: type,
        },
        topic: topic,
    }
}

function createGameMessage(gameEvent) {
    return {
        notification: {
            title: 'Game message',
        },
        data: {
            gameEvent: gameEvent,
        },
        topic: topic,
    }
}

function sendMessage(message) {
    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('Successfully sent message:', response)
        })
        .catch((error) => {
            console.log('Error sending message:', error)
        })
}

module.exports = app
