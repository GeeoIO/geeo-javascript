module.exports = {
	entry: "./lib/index.js",
    output: {
        library: "geeo",
		libraryTarget: "var"
    },
	externals: {
		"wolfy87-eventemitter": false,
		"whatwg-fetch": false
	}
}