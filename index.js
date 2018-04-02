process.env.TZ = 'Europe/Berlin' 

const player = require('play-sound')(opts = {}) 
const schedule = require('node-schedule')
const moment = require('moment-timezone')

const s = require('./schedule')

console.log('Time is now: ' + moment(Date.now()).format('LLLL'))

schedule.scheduleJob('0 7 * * FRI', () => {
	player.play('audio/f.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

schedule.scheduleJob('0 18 * * MON', () => {
	player.play('audio/f.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

s.forEach(day => {
	day.times.forEach(t => {
		const time = t.join(':')
		const date = moment(day.date + ' ' + time).tz(process.env.TZ)

		console.log('Scheduling an alarm at: ' + date.format('LLLL'))

		schedule.scheduleJob(date.toDate(), () => {
			player.play(day.audio, (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
		})
	})
})

setInterval(() => {
	console.log('I\'m alive!')
}, 1000 * 60 * 60)
