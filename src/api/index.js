import express from 'express'

import c from '../config'
import {kill, play} from '../lib/audio-manager'

const app = express()
app.get('/stop-audio', (req, res) => kill() || res.send('Stop audio has been triggered.'))
app.get('/get-big', (req, res) => {
    play('audio/getbig.mp3')
    .then(() => res.send('Get Big!'))
	.catch(err => console.error('failed to get big :(', err))
})
app.listen(c.port, () => console.log(`app listens on port ${c.port}`))

export default app