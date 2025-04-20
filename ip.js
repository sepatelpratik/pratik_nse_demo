const os = require('os');

function getCurrentIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip internal (i.e., 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'IP not found';
}

console.log('Your IP Address is:', getCurrentIP());
module.exports={getCurrentIP}