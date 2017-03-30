const {resolve} = require('path')
const {convert, moveToTemp} = require('../models')

module.exports = function(app) {
	app.get('/', (req, res) => {
		res.type('text/plain')
		res.sendFile(resolve(__dirname, '../README.md'))
	})

	app.post('/:format', (req, res) => {
		const {format} = req.params
		const options = {} // TODO

		Promise
			.resolve(req.files)
			.then(files => {
				if (!files) throw new Error('No files were uploaded.')

				const callArr = Object
					.keys(files)
					.map(id => moveToTemp(files[id])
						.then(tempPath => convert(tempPath, format, options))
						.then(data => ({ id, data }))
					)

				return Promise.all(callArr)
			})
			.then(resArr => {
				res.send(Object.assign({}, ...resArr))
			})
			.catch(err => {
				res.send({ code: 1, error: err.message })
			})
	})
}
