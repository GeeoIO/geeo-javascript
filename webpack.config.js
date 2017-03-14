module.exports = {
    output: {
        libraryTarget: "commonjs2",
        library: "geeo-javascript"
    },
	externals: {
		"wolfy87-eventemitter": false,
		"whatwg-fetch": false
	}
}