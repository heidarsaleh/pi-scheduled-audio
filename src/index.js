import dotenv from 'dotenv'
import schedule from 'node-schedule'
import moment from 'moment-timezone'

import s from './schedule'
import host from './lib/host'
import {push} from './lib/push-notifications'
import {play} from './lib/audio-manager'
import './api'

dotenv.config()

console.log('Time is now: ' + moment(Date.now()).format('LLLL'))

schedule.scheduleJob('0 7 * * FRI', () => {
	play('audio/f.mp3')
	.catch(err => console.error('failed to run Friday\'s task', err))
})

schedule.scheduleJob('0 20 * * 1-5', () => {
	play('audio/goodnight.mp3')
	.catch(err => console.error('failed to run evening\'s task', err))
})

s.forEach(day => {
	day.times.forEach(t => {
		const time = t.slice(0, 3).join(':')
		const date = moment(day.date + ' ' + time).tz(process.env.TZ)

		console.log('Scheduling an alarm at: ' + date.format('LLLL'))

		schedule.scheduleJob(date.toDate(), () => {
				Promise.all([
					play(day.audio),
					push({
						message: t[3] || 'PI Alarm!',
						title: t[4] || 'PI Wanna Say something!',
						url: host ? `${host}stop-audio` : undefined,
  						url_title: host ? "Stop Audio" : undefined
					})
				])
				.catch(err => console.error('failed to run daily\'s task', err))
		})
	})
})