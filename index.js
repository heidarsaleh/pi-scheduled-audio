process.env.TZ = 'Europe/Berlin' 

const player = require('play-sound')(opts = {}) 
const schedule = require('node-schedule')
const moment = require('moment-timezone')
const Push = require('pushover-notifications')

const s = require('./schedule')
const c = require('./config')

console.log('Time is now: ' + moment(Date.now()).format('LLLL'))

var p = new Push( {
	user: c.user,
	token: c.token
  })

schedule.scheduleJob('0 7 * * FRI', () => {
	player.play('audio/f.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

s.forEach(day => {
	day.times.forEach(t => {
		const time = t.slice(0, 3).join(':')
		const date = moment(day.date + ' ' + time).tz(process.env.TZ)

		console.log('Scheduling an alarm at: ' + date.format('LLLL'))

		schedule.scheduleJob(date.toDate(), () => {
			player.play(day.audio, (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
			var msg = {
				message: t[3] || 'PI Alarm!',
				title: t[4] || 'PI Wanna Say something!'
			  }
			   
			  p.send( msg, function( err, result ) {
				if ( err ) {
				  throw err
				}
			   
				console.log( result )
			  })
		})
	})
})

setInterval(() => {
	console.log('I\'m alive!')
}, 1000 * 60 * 60)
