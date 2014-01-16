module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
				separator: '\n'
			},
			main : {
				src: [
					'src/**/*.js'
				],
				dest: 'dist/<%= pkg.version %>/<%= pkg.name %>.js'
			}
		},
		
		uglify: {
			main : {
				files: {
					'dist/<%= pkg.version %>/<%= pkg.name %>.min.js': [
						'<%= concat.main.dest %>'
					]
				}
			}
		},
		
		jshint : {
			options : {
				browser : true
			},
			main : [
				'src/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [
		'jshint:main',
		'concat:main',
		'uglify:main'
	]);
	
};