const {resolve} = require('path')
const {convertAll} = require('../models')

module.exports = function(app) {
	app.get('/', (req, res) => {
		res.type('text/plain')
		res.sendFile(resolve(__dirname, '../README.md'))
	})

	app.post('/:format', (req, res) => {
		const {format} = req.params

		Promise
			.resolve(req.files)
			.then(files => {
				if (!files) throw new Error('No files were uploaded.')
				return convertAll(files, format, req.query)
			})
			.then(resArr => {
				const result = {}
				resArr.forEach(({id, data}) => {
					result[id] = data
				})
				res.send(result)
			})
			.catch(err => {
				res.send({ code: 1, error: err.message })
			})
	})
}
