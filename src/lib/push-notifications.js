import Push from 'pushover-notifications'

import c from '../config'

const pushManager = new Push({
    user: c.user,
    token: c.token
})

export const push = (msg) => new Promise((resolve, reject) => pushManager.send(msg, (err, result) => {
    if (err) {
        reject(err)
    } else {
        resolve()
    }
}))