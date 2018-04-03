import express from 'express'

import c from '../config'
import {kill} from '../lib/audio-manager'

const app = express()
app.get('/stop-audio', (req, res) => kill() || res.send('Stop audio has been triggered.'))
app.listen(c.port, () => console.log(`app listens on port ${c.port}`))

export default app;