const imgConvert = require('img-convert')
const { uniq } = require('lodash')
const crypto = require('crypto')
const fs = require('fs-extra')
const { resolve, join, extname } = require('path')

const tmpFolder = resolve(__dirname, '../tmp')

function del(...paths) {
	return Promise.all(uniq(paths).map(path => fs.unlink(path)))
}

async function moveToTemp(file) {
	const newName = crypto.randomBytes(15).toString('hex') + extname(file.name)
	const newPath = join(tmpFolder, newName)
	await file.mv(newPath)

	return newPath
}

module.exports = async function(file, format, params={}) {
	const srcPath = await moveToTemp(file)
	const targetPath = srcPath.replace(extname(srcPath), `.${format}`)
	const path = await imgConvert(srcPath, targetPath, params)
	const data = await fs.readFile(path, 'base64')
	await del(srcPath, targetPath)

	return data
}
