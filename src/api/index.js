import express from 'express'

import c from '../config'
import {kill, play} from '../lib/audio-manager'

const app = express()
app.get('/stop-audio', (req, res) => kill() || res.send('Stop audio has been triggered.'))
app.get('/get-big', (req, res) => {
    console.log('playing Get Big!');
    play('audio/getbig.mp3')
    res.send('Get Big!')
})
app.listen(c.port, () => console.log(`app listens on port ${c.port}`))

export default app