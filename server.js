'use strict'

const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const compression = require('compression')
const rfs = require('rotating-file-stream')

const env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 9999

const app = express()

app.use(fileUpload())
app.use(compression())
app.use(express.json())

if (env == 'production') {
	// Логирование последних суток
	const accessLogStream = rfs('access.log', { interval: '1d', path: __dirname })
	app.use(morgan('short', { stream: accessLogStream }))
}
else {
	app.use(morgan('dev'))
}

require('./controllers')(app)

/* eslint-disable no-console, no-process-exit */
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
		process.exit(1)
	})
	.on('unhandledRejection', (reason, p) => {
		console.log(`Unhandled Rejection at Promise ${p} reason: ${reason}`)
	})
