/*global module:false*/
module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
       
    // Project metadata.
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      scripts: {
        src: ["js/**/*.js"],
        dest: 'dist/js/pClock.pkg.js'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        asi: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          console: true,
          Raphael: true,
          require: true
        }
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      scripts: {
        src: 'js/*.js'
      }
    },

    uglify:{
      scripts:{
        options: {
          compress: true,
          mangle: true
        },
        files:{
          'dist/js/pClock.pkg.min.js' : 'dist/js/pClock.pkg.js'
        }
      },
    },

    cssmin: {
      combine: {
        files: {
          'dist/css/styles.min.css': ['css/*.css']
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: ['index.html','README.md'],
            dest: 'dist/'
          }
        ]
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: 'js/*.js',
        tasks: [ 'jshint:scripts' , 'concat:scripts', 'uglify:scripts', 'cssmin', 'copy:dist' ]
      }
    }

  });

  // Default task.
  grunt.registerTask(
    'default',
    'Runs linting on Javascript, concats and uflifys the js',
    [ 'jshint', 'concat', 'uglify', 'cssmin', 'copy' ]
  );

};



