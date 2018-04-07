import express from 'express'

import c from '../config'
import {kill, play} from '../lib/audio-manager'

const app = express()
app.get('/stop-audio', (req, res) => kill() || res.send('Stop audio has been triggered.'))
app.get('/get-big', async (req, res) => {
    try {
        console.log('playing Get Big!');
        await play('audio/getbig.mp3')
        res.send('Get Big!')
    } catch(err) {
        res.send('Get Big Failed!')
    }
})
app.listen(c.port, () => console.log(`app listens on port ${c.port}`))

export default app