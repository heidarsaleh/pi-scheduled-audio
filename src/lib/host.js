import os from 'os'

import {port} from '../config'

let host
const ifaces = os.networkInterfaces()

Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
    if ('IPv4' !== iface.family || iface.internal !== false) return
    if(ifname === 'wlan0') {
        host = `http://${iface.address}:${port}/`
	  }
  })
})

export default host