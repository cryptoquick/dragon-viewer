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
      setup: {
        files: {
          'public/<%= pkg.name %>.vendor.js': ['vendor.js']
        },
        options: {
          debug: grunt.cli.tasks[0] !== 'dist',
          alias: [
            'vendor/jquery/jquery.js:jquery',
            'vendor/emblem/lib/emblem.js:emblem',
            'vendor/ember-data/ember-data.js:ember-data',
            'vendor/pouchdb/src/pouch.js:pouchdb',
            // 'vendor/ember-pouchdb/dist/ember-pouchdb.js:ember-pouchdb',
          ],
          shim: {
            handlebars: {
              path: 'vendor/handlebars/handlebars.js',
              exports: 'Handlebars'
            },
            ember: {
              path: 'vendor/ember/ember.js',
              exports: 'Ember'
            },
            'ember-pouchdb': {
              path: 'vendor/ember-pouchdb/dist/ember-pouchdb.js',
              exports: 'EPDB'
            }
          }
        }
      },
      'default': {
        files: {
          'public/<%= pkg.name %>.js': ['app/**/*.js']
        },
        options: {
          external: 'public/<%= pkg.name %>.vendor.js',
          debug: grunt.cli.tasks[0] !== 'dist'
        }
      }
    },

    emblem: {
      compile: {
        files: {
          'tmp/templates.js': 'app/templates/**/*.emblem',
        },
        options: {
          root: 'app/templates/',
          dependencies: {
            jquery: 'vendor/jquery/jquery.js',
            ember: 'vendor/ember/ember.js',
            emblem: 'vendor/emblem/dist/emblem.js',
            handlebars: 'vendor/handlebars/handlebars.js',
          }
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'Ember.TEMPLATES',
          node: true
        },
        files: {
          'tmp/templates.js': 'app/templates/**/*.hbs',
        }
      }
    },

    uglify: {
      'default': {
        files: {
          'public/<%= pkg.name %>.min.js': ['public/<%= pkg.name %>.js']
        },
        options: {
          report: 'min'
        }
      }
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
  
  grunt.registerTask('setup', ['bower_install', 'browserify:setup'])
  grunt.registerTask('default', ['stylus', 'emblem', 'browserify:default', 'copy'])
  grunt.registerTask('dist', ['clean', 'default', 'uglify', 'copy'])
}
