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

const createDailyMessage = times => times.map(t => `${t[0]}:${t[1]} ${t[3]}`).join('\n')

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
						message: `${day.message}\n${createDailyMessage(day.times.filter(mt => mt[0]+mt[1] > t[0]+t[1]))}`,
						title: `${t[3]} ${t[4]}`,
						url: host ? `${host}stop-audio` : undefined,
  						url_title: host ? "Stop Audio" : undefined
					})
				])
				.catch(err => console.error('failed to run daily\'s task', err))
		})
	})
})