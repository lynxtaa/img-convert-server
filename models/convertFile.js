const imgConvert = require('img-convert')
const crypto = require('crypto')
const fs = require('fs-extra')
const { join, extname } = require('path')

const tmpFolder = require('os').tmpdir()

const getTmpPath = fileName => join(tmpFolder, crypto.randomBytes(15).toString('hex') + extname(fileName))

module.exports = async function(file, format, params={}) {
	const srcPath = getTmpPath(file.name)

	await file.mv(srcPath)

	const targetPath = srcPath.replace(extname(srcPath), `.${format}`)

	const path = await imgConvert(srcPath, targetPath, params)
	const data = await fs.readFile(path, 'base64')

	if (srcPath == targetPath) {
		await fs.unlink(srcPath)
	}
	else {
		await Promise.all([fs.unlink(srcPath), fs.unlink(targetPath)])
	}

	return data
}
