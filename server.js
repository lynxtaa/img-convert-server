/* eslint-disable no-console */

const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const compression = require('compression')
const fs = require('fs')
const fsPr = require('pr-wrap').all(fs)
const {join} = require('path')

const env = process.env.NODE_ENV || 'development'
const PORT = 9999

const app = express()

// Сброс таймаута для запросов
app.use((req, res, next) => {
	req.setTimeout(0)
	next()
})

app.use(fileUpload())
app.use(compression())

// Логирование
if (env == 'development') {
	app.use(morgan('tiny'))
}
/*else {
	const logStream = fs.createWriteStream(join(__dirname, 'access.log'), { flags: 'a' })
	app.use(morgan('tiny', { stream: logStream }))
}*/

function cleanUp(dir) {
	return fsPr.readdir(dir)
		.then(contents => {
			const callArr = contents.map(name => {
				const fullPath = join(dir, name)
				return fsPr.unlink(fullPath)
			})
			return Promise.all(callArr)
		})
		.catch(() => fsPr.mkdir(dir))
}

// Папка для временных файлов
const tmpDir = join(__dirname, 'tmp')
cleanUp(tmpDir)

require('./controllers')(app)

app
	.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`)
		console.log(`Server running in '${env}' mode`)
	})
	.on('error', err => {
		console.log(err.code == 'EADDRINUSE' ? 'Address in use. Is the server already running?' : err)
	})

process
	.on('uncaughtException', err => {
		console.log(`Uncaught Exception: ${err}`)
		// eslint-disable-next-line no-process-exit
		process.exit(1)
	})
	.on('unhandledRejection', (reason, p) => {
		console.log(`Unhandled Rejection at Promise ${p} reason: ${reason}`)
	})

/* eslint-enable no-console */
