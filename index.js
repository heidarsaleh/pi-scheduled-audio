process.env.TZ = 'Europe/Berlin' 

const player = require('play-sound')(opts = {}) 
const schedule = require('node-schedule')
const moment = require('moment-timezone')
const Push = require('pushover-notifications')
const express = require('express')

const s = require('./schedule')
const c = require('./config')
const app = express()

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

console.log('Time is now: ' + moment(Date.now()).format('LLLL'))

let activeAudio;
const killAudio = () => {
	try { 
		activeAudio && activeAudio.kill ? activeAudio.kill() : undefined 
	} catch(err) {console.error('failed to kill audio', err)}}

var p = new Push( {
	user: c.user,
	token: c.token
  })

schedule.scheduleJob('0 7 * * FRI', () => {
	killAudio()
	activeAudio = player.play('audio/f.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

schedule.scheduleJob('0 20 * * 1-5', () => {
	killAudio()
	activeAudio = player.play('audio/goodnight.mp3', (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
})

s.forEach(day => {
	day.times.forEach(t => {
		const time = t.slice(0, 3).join(':')
		const date = moment(day.date + ' ' + time).tz(process.env.TZ)

		console.log('Scheduling an alarm at: ' + date.format('LLLL'))

		schedule.scheduleJob(date.toDate(), () => {
			killAudio()
			activeAudio = player.play(day.audio, (err) => err ? console.log('Error!', err) : console.log('Succeeded!'))
			var msg = {
				message: t[3] || 'PI Alarm!',
				title: t[4] || 'PI Wanna Say something!'
			  }
			   
			  p.send( msg, function( err, result ) {
				if ( err ) {
				  throw err
				}
			   
				console.log(result)
			  })
		})
	})
})

app.get('/killAudio', (req, res) => killAudio() || res.send('Sound has been killed successfully!'))

app.listen(3030, () => console.log('app listens on port 3030'))

setInterval(() => {
	console.log('I\'m alive!')
}, 1000 * 60 * 60)
