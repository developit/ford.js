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
				options: {
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
				},
				files: {
					'dist/<%= pkg.version %>/<%= pkg.name %>.min.js': [
						'<%= concat.main.dest %>'
					]
				}
			}
		},
		
		jshint : {
			options : {
				'browser' : true
			},
			main : {
				options : {
					'-W041' : true,
					'-W030' : true			// && as guard
				},
				src : ['src/**/*.js']
			},
			test : {
				options : {
					'-W030' : true
				},
				src : [
					'test/**/*.js',
					'!test/js/**/*'
				]
			}
		},
		
		mocha : {
			test : {
				options : {
					run : true,
					reporter : 'Spec',
					urls : [
						'test/index.html'
					]
				}
			}
		},
		
		watch : {
			options : {
				interrupt : true
			},
			src : {
				files : ['src/**/*.js'],
				tasks : ['default']
			},
			test : {
				files : ['test/**/*'],
				tasks : ['test']
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');


	grunt.registerTask('default', [
		'jshint:main',
		'concat:main',
		'uglify:main'
	]);


	grunt.registerTask('test', [
		'jshint:test',
		'mocha:test'
	]);

};