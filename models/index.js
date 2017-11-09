const imgConvert = require('img-convert')
const _ = require('lodash')
const crypto = require('crypto')
const fs = require('fs-extra')
const { resolve, join, extname } = require('path')

const tmpFolder = resolve(__dirname, '../tmp')

const del = (...paths) => Promise.all(_.uniq(paths).map(path => fs.unlink(path)))

exports.convertAll = function(files, format, params={}) {
	async function convert(srcPath) {
		const targetPath = srcPath.replace(extname(srcPath), `.${format}`)
		const path = await imgConvert(srcPath, targetPath, params)
		const data = await fs.readFile(path, 'base64')

		await del(srcPath, targetPath)

		return data
	}

	const callArr = Object
		.keys(files)
		.map(id => moveToTemp(files[id])
			.then(convert)
			.then(data => ({ id, data }))
		)

	return Promise.all(callArr)
}

async function moveToTemp(file) {
	const newName = crypto.randomBytes(15).toString('hex') + extname(file.name)
	const newPath = join(tmpFolder, newName)
	await file.mv(newPath)

	return newPath
}
