module.exports = function(grunt){

	grunt.initConfig({
		jshint:{
			files:['public/**/*js','server/**/*.js','server.js']
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
}