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
        dest: 'js/dist/pClock.pkg.js'
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
          'dist/js/pClock.pkg.min.js' : 'js/dist/pClock.pkg.js'
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
            src: ['index.html','README.md','libraries/**/*'],
            dest: 'dist/'
          }
        ]
      }
    },


    'string-replace': {
      inline: {
        files: {
          'dist/index.html': 'dist/index.html'
        },
        options: {
          replacements: [
            {
              pattern: '<!--start PROD css-imports',
              replacement: '<!--start PROD css-imports-->'
            },
            {
              pattern: 'end PROD css-imports-->',
              replacement: '<!--end PROD css-imports-->'
            },
            {
              pattern: '<!--start DEV css-imports-->',
              replacement: '<!--start DEV imports'
            },
            {
              pattern: '<!--end DEV css-imports-->',
              replacement: 'end DEV css-imports-->'
            },
            {
              pattern: '<!--start PROD js-imports',
              replacement: '<!--start PROD js-imports-->'
            },
            {
              pattern: 'end PROD js-imports-->',
              replacement: '<!--end PROD js-imports-->'
            },
            {
              pattern: '<!--start DEV js-imports-->',
              replacement: '<!--start DEV js-imports'
            },
            {
              pattern: '<!--end DEV js-imports-->',
              replacement: 'end DEV js-imports-->'
            }
          ]
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      html: {
        files: '**/*.html',
        tasks: [ 'prod', 'copy:dist' ]
      },
      scripts: {
        files: 'js/*.js',
        tasks: [ 'jshint:scripts' , 'concat:scripts', 'uglify:scripts', 'copy:dist', 'string-replace' ]
      },
      css: {
        files: '**/*.css',
        tasks: [ 'copy:dist', 'cssmin', 'copy:dist' ]
      }
    }

  });

  // Default task.
  grunt.registerTask(
    'default',
    'Runs linting on Javascript, concats and uflifys the js',
    [ 'jshint', 'concat', 'uglify', 'cssmin', 'copy', 'string-replace' ]
  );

};



