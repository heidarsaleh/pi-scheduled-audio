import Player from 'play-sound'

const player = Player()
let activeAudio;

export const kill = () => {
	try { 
		activeAudio && activeAudio.kill ? activeAudio.kill() : undefined 
    } catch(err) {
        console.error('failed to kill audio', err)
    }
}

export const play = audioUrl => {
    kill()
    return new Promise((resolve, reject) => {
        activeAudio = player.play(audioUrl, (err) => err ? reject(new Error('Audio play failed: ' + err.message)) : resolve())
    })
}
