module.exports = function(grunt) {
	// Configure grunt
	grunt.initConfig({
		imagemin: {
			dynamic: {
				files: [{
					expand: true,				  // Enable dynamic expansion
					cwd: 'public/img_dev',			// Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
					dest: 'public/img'	   // Destination path prefix
				}]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	
	grunt.registerTask('default', ['imagemin']);
};