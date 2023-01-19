const json_file = require("./languages/french.json")
// const json_file = require("./languages/Javascript.json")

async function makeWordsList() {
	const arr = []
	let min = 0
	let max = json_file.length
	for (let i = 0; i < 25; i++) {
		let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
		arr.push(json_file[randomNumber]) // mot aléatoire
	}
	return arr
}
async function makeColors(arr) {
	const newArr = []
	for (let index = 0; index < arr.length; index++) {
		let row = []
		try {
			for (let idx = 0; idx < arr[index].length; idx++) {
				row.push("#646669")
			}
		} catch (error) {
			console.log(arr)
			console.log(error + " : " + arr[index])
		}
		newArr.push(row)
	}
	return newArr
}

module.exports = { makeWordsList, makeColors }
