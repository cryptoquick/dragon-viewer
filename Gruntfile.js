module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({
    pkg: pkg,

    watch: {
      css: {
        files: ['styles/*.styl', 'styles/**/*.styl'],
        tasks: ['stylus'],
        options: {
          atBegin: true
        }
      },
      js: {
        files: ['app/**/*.emblem'],
        tasks: ['emblem'],
        options: {
          atBegin: true
        }
      },
      livereload: {
        files: ['app/*', 'styles/*'],
        options: {
          livereload: true
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'public/<%= pkg.name %>.css': ['styles/*.styl', 'styles/**/*.styl']
        }
      }
    },

    browserify: {
      files: {
        'public/app.js': 'app/index.js'
      },
      options: {
        debug: grunt.cli.tasks[0] !== 'dist',
        alias: [
          'lib/jquery.js:jquery',
          'lib/handlebars.js:handlebars',
          'lib/emblem.js:emblem',
          'lib/ember.js:ember',
          'lib/ember-data.js:ember-data',
          'lib/pouchdb.js:pouchdb',
          'lib/ember-pouchdb.js:ember-pouchdb',
        ],
        noparse: [
          'lib/jquery.js',
          'lib/handlebars.js',
          'lib/emblem.js',
          'lib/ember.js',
          'lib/ember-data.js',
          'lib/pouchdb.js',
          'lib/ember-pouchdb.js',
        ]
      }
    },

    emblem: {
      compile: {
        files: {
          'tmp/templates.js': 'app/templates/**/*.emblem', //1:1 compile
        },
        options: {
          root: 'app/templates/',
          dependencies: {
            jquery: 'lib/jquery.js',
            ember: 'lib/ember.js',
            emblem: 'lib/emblem.js',
            handlebars: 'lib/handlebars.js',
          }
        }
      }
    },

    uglify: {
      'default': {
        files: {
          'public/<%= pkg.name %>.min.js': ['tmp/app.js']
        }
      }
    },

    curl: {
      jquery: {
        src: 'http://code.jquery.com/jquery-1.10.2.js',
        dest: 'lib/jquery.js'
      },
      handlebars: {
        src: 'http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v1.1.2.js',
        dest: 'lib/handlebars.js'
      },
      emblem: {
        src: 'https://github.com/machty/emblem.js/raw/master/dist/emblem.js',
        dest: 'lib/emblem.js'
      },
      ember: {
        src: 'http://builds.emberjs.com/tags/v1.2.0/ember.js',
        dest: 'lib/ember.js'
      },
      'ember-data': {
        src: 'http://builds.emberjs.com/tags/v1.0.0-beta.3/ember-data.js',
        dest: 'lib/ember-data.js'
      },
      'ember-pouchdb': {
        src: 'https://raw.github.com/taras/ember-pouchdb/master/dist/ember-pouchdb.amd.js',
        dest: 'lib/ember-pouchdb.js'
      },
      pouchdb: {
        src: 'http://download.pouchdb.com/pouchdb.amd-nightly.js',
        dest: 'lib/pouchdb.js'
      },
    },

    clean: ['public'],

    copy: {
      'default': {
        files: [
          { src: 'index.html', dest: 'public/index.html' },
        ]
      }
    },

    nodewebkit: {
      options: {
          build_dir: 'build',
          mac: true,
          win: true,
          linux32: false,
          linux64: false,
      },
      src: ['public/**/*']
    }
  })

  // load all grunt tasks from package.json
  Object.keys(pkg.devDependencies).forEach(function (task) {
    if (task.indexOf('grunt') === 0 && task !== 'grunt')
      grunt.loadNpmTasks(task)
  })
  
  grunt.registerTask('setup', ['curl'])
  grunt.registerTask('default', ['stylus', 'emblem', 'browserify'])
  grunt.registerTask('dist', ['clean', 'default', 'copy'])
}
