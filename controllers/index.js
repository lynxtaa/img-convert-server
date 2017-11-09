const { resolve } = require('path')
const { convertFile, graph } = require('../models')

const sendRes = res => [
	res.send.bind(res),
	err => res.send({ code: 1, error: err.message }),
]

module.exports = function(app) {
	app.all('/', (req, res) => {
		res.type('text/plain')
		res.sendFile(resolve(__dirname, '../README.md'))
	})

	app.post('/graph', (req, res, next) => {
		graph(req.body).then(...sendRes(res))
	})

	app.post('/:format', (req, res) => {
		Promise
			.resolve(req.files)
			.then(files => {
				if (!files) {
					throw new Error('No files were uploaded.')
				}

				const callArr = Object.keys(files).map(id =>
					convertFile(files[id], req.params.format, req.query)
						.then(data => ({ [id]: data }))
				)

				return Promise.all(callArr)
			})
			.then(resArr => Object.assign({}, ...resArr))
			.then(...sendRes(res))
	})
}
