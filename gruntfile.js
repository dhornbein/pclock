/*global module:false*/
module.exports = function(grunt) {

  var settings = grunt.file.readYAML('config.yml');

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
       
    // Project metadata.
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        curly: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        asi: true,
        sub: true,
        undef: true,
        // unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          Avgrund: true,
          Mousetrap: true,
          console: true,
          Raphael: true,
          require: true,
          fs: true
        }
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      js: {
        src: ['js/*.js','!js/plugins.js']
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
      },
      distSrc: {
        files: [
          {
            expand: true,
            src: ['index.html','README.md','libraries/**/*','js/**/*','css/**/*'],
            dest: 'dist/src/'
          }
        ]
      }
    },

    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html: 'dist/index.html'
    },

    connect: {
      server: {
        options: {
          port: settings.serverPort,
          base: '.',
          hostname: 'localhost',
          livereload: true
          // middleware: function(connect, options, middlewares) {
          //   // inject a custom middleware into the array of default middlewares
          //   middlewares.push(function(req, res, next) {
          //     if (req.url !== '/node_modules/pclock_savesvg') {
          //       return next();
          //     }
          //     res.end('Hello, world from port');
          //   });

          //   return middlewares;
          // }
        }
      }
    },

    watch: {
      options: {
        livereload: settings.liveReloadPort
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      html: {
        files: '*.html',
        tasks: [ 'useminPrepare', 'copy:dist', 'usemin', 'copy:distSrc' ]
      },
      scripts: {
        files: './js/*.js',
        tasks: [ 'jshint:js' , 'copy:dist', 'useminPrepare', 'concat:generated', 'uglify:generated', 'copy:distSrc' ]
      },
      css: {
        files: './css/**/*.css',
        tasks: [ 'useminPrepare', 'cssmin:generated', 'copy:dist', 'copy:distSrc' ]
      }
    },

    parallel: {
      watch: {
        options: {
          grunt: true,
          stream: true
        },
        tasks: ['watch']
      }
    }

  });

  // Default task eg. what happens when we simply run 'grunt'
  grunt.registerTask(
    'default',
    'Runs linting on Javascript, concats and uflifys the js',
    [ 'serve' ]
  );

  //////////////////////////////
  // Server Task
  //
  grunt.registerTask('serve', 'start the dev server', function(){
    // do a first run build
    grunt.task.run(['useminPrepare','concat:generated','uglify:generated','cssmin:generated','copy:dist','usemin','copy:distSrc']);
    // run the server task
    grunt.task.run('connect');
    // watch for changes
    grunt.task.run('parallel:watch');
  });

};



