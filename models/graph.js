const snap = require('cytosnap')()
const start = snap.start()

module.exports = options => start.then(() => snap.shot(options))
