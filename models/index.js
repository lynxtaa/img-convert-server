const imgConvert = require('img-convert')
const fs = require('fs')
const crypto = require('crypto')
const prWrap = require('pr-wrap')
const {resolve, join, extname} = require('path')

exports.moveToTemp = function(file) {
	const tmpFolder = resolve(__dirname, '../tmp')
	const newName = crypto.randomBytes(15).toString('hex') + extname(file.name)
	const newPath = join(tmpFolder, newName)

	return prWrap(file.mv, file)(newPath).then(() => newPath)
}

exports.convert = function(srcPath, format, params={}) {
	const getBase64 = path => prWrap(fs.readFile)(path, 'base64')
	const targetPath = srcPath.replace(extname(srcPath), `.${format}`)

	return imgConvert(srcPath, targetPath, params).then(getBase64)
}
