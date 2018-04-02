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
	// httpOptions: {
	//   proxy: process.env['http_proxy'],
	//},
	// onerror: function(error) {},
	// update_sounds: true // update the list of sounds every day - will
	// prevent app from exiting.
  })

schedule.scheduleJob('0 7 * * FRI', () => {
	player.play('audio/f.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

s.forEach(day => {
	day.times.forEach(t => {
		const time = t.slice(0, 3).join(':')
		const date = moment(day.date + ' ' + time).tz(process.env.TZ)

		console.log('Scheduling an alarm at: ' + date.format('LLLL'))

		var msg = {
			// These values correspond to the parameters detailed on https://pushover.net/api
			// 'message' is required. All other values are optional.
			message: t[3] || 'PI Alarm!',	// required
			title: t[4] || 'PI Wanna Say something!'/*,
			sound: 'magic',
			device: 'devicename',
			priority: 1*/
		  }
		   
		  p.send( msg, function( err, result ) {
			if ( err ) {
			  throw err
			}
		   
			console.log( result )
		  })

		schedule.scheduleJob(date.toDate(), () => {
			player.play(day.audio, (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
		})
	})
})

setInterval(() => {
	console.log('I\'m alive!')
}, 1000 * 60 * 60)
