const imgConvert = require('img-convert')
const fs = require('fs')
const crypto = require('crypto')
const prWrap = require('pr-wrap')
const {resolve, join, extname} = require('path')

exports.convertAll = function(files, format, params={}) {
	params = prepareParams(params)

	function convert(srcPath) {
		const targetPath = srcPath.replace(extname(srcPath), `.${format}`)
		return imgConvert(srcPath, targetPath, params).then(getBase64)
	}

	const callArr = Object
		.keys(files)
		.map(id => moveToTemp(files[id])
			.then(convert)
			.then(data => ({ id, data }))
		)

	return Promise.all(callArr)
}

function moveToTemp(file) {
	const tmpFolder = resolve(__dirname, '../tmp')
	const newName = crypto.randomBytes(15).toString('hex') + extname(file.name)
	const newPath = join(tmpFolder, newName)

	return prWrap(file.mv, file)(newPath).then(() => newPath)
}

function getBase64(path) {
	return prWrap(fs.readFile)(path, 'base64')
}

function prepareParams(params) {
	const result = Object.assign({}, params)

	Object.keys(result).forEach(key => {
		const num = +result[key]
		if (!isNaN(num)) {
			result[key] = num
		}
	})
	return result
}
