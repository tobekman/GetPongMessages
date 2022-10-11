const express = require('express')
const admin = require('firebase-admin')
const serviceAccount = require('./getpong-68dfd-firebase-adminsdk-9ovm9-d48c043e57.json')
const app = express()
const topic = 'getpong'

let currentSetId = 0

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://getpong-68dfd.firebaseio.com',
})

app.get('/score/hometeam/add', (req, res) => {
    let message = createScoreMessage(currentSetId.toString(), 'homeTeam', 'add')
    sendMessage(message)
    res.send('Point added to home team')
})
app.get('/score/hometeam/remove', (req, res) => {
    let message = createScoreMessage(
        currentSetId.toString(),
        'homeTeam',
        'remove'
    )
    sendMessage(message)
    res.send('Point removed from home team')
})
app.get('/score/awayteam/add', (req, res) => {
    let message = createScoreMessage(currentSetId.toString(), 'awayTeam', 'add')
    sendMessage(message)
    res.send('Point added to away team')
})
app.get('/score/awayteam/remove', (req, res) => {
    let message = createScoreMessage(
        currentSetId.toString(),
        'awayTeam',
        'remove'
    )
    sendMessage(message)
    res.send('Point removed from away team')
})

app.get('/game/add-set', (req, res) => {
    let message = createGameMessage('add')
    sendMessage(message)
    currentSetId++
    res.send('Set added')
})
app.get('/game/remove-set', (req, res) => {
    let message = createGameMessage('remove')
    sendMessage(message)
    currentSetId--
    res.send('Set removed')
})
app.get('/game/save', (req, res) => {
    let message = createGameMessage('save')
    sendMessage(message)
    currentSetId = 0
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
