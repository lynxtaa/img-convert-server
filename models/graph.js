const snap = require('cytosnap')()

module.exports = async function(options) {
	await snap.start()
	const base64Img = await snap.shot(options)
	await snap.stop()

	return base64Img
}
