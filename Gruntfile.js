module.exports = function(grunt) {

  var
    grep = grunt.option('grep'),
    reporter = grunt.option('reporter') || 'dot';

  grunt.initConfig({
    watch: {
      source: {
        files: ['src/**/*.js'],
        tasks: ['exec:runTest']
      },
      server: {
        files: ['node_modules/consoloid-server/**/*.js'],
        tasks: ['exec:runTest']
      },
      framework: {
        files: ['node_modules/consoloid-framework/**/*.js'],
        tasks: ['exec:runTest']
      },
      console: {
        files: ['node_modules/consoloid-console/**/*.js'],
        tasks: ['exec:runTest']
      },
      automatic: {
        files: [
          'src/**/*.js',
          'node_modules/consoloid-os/Consoloid/**/*.js',
          'node_modules/consoloid-server/Consoloid/**/*.js',
          'node_modules/consoloid-console/Consoloid/**/*.js',
          'node_modules/consoloid-framework/Consoloid/**/*.js',
          ],
      }
    },

    exec: {
      runTest: {
        command: './test '+(grep ? ' -g '+grep : '')+' -R '+reporter
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  require('consoloid-framework/Consoloid/Test/Environment');

  var
    MochaTester = {

      mochaOptions: {
        reporter: reporter
      },

      Mocha: require('consoloid-framework/node_modules/mocha'),
      path: require('path'),
      fs: require('fs'),

      registerToWatchTask: function(target, mochaOptions){
        var tester = Object.create(this);

        tester.target = target;
        tester.mochaOptions = mochaOptions ? mochaOptions : this.mochaOptions;
        grunt.event.on("watch", tester.listener.bind(tester));

        return tester;
      },

      listener: function(action, filepath, target)
      {
        if (!this.isListenedEvent(action, target)) {
          return;
        }

        var testFile = this.getTestFilePath(filepath);

        if (filepath != testFile) {
          this.clearCache(filepath);
        }

        this.clearCache(testFile);
        this.createMochaWithFile(testFile);

        setTimeout(this.run.bind(this), 500);
      },

      isListenedEvent: function(action, target)
      {
        return action == 'changed' && target == this.target;
      },

      getTestFilePath: function(filepath)
      {
        var
          isTestFile = filepath.indexOf('Test.js') != -1,
          testFile = !isTestFile ? filepath.replace(/(.+)\/(\w+)\.js/, '$1/test/$2Test.js') : filepath;

        if (!isTestFile && !this.path.existsSync(testFile)) {
          throw new Error('\nStop editing this file!\nIt has not unit tests:P\n' + testFile)
        }

        return testFile;
      },

      clearCache: function(filepath)
      {
        require.cache[require.resolve('./'+filepath)] = undefined;
      },

      createMochaWithFile: function(filepath)
      {
        this.mocha = new this.Mocha(this.mochaOptions);
        this.mocha.addFile(filepath);
      },

      run: function()
      {
        this.mocha.run(function(failureCount){
          if (failureCount) {
            grunt.log.error('falling: ' + failureCount)
          } else {
            grunt.log.ok('OK');
          }
        });
      }
    }

  MochaTester.registerToWatchTask('automatic');

};
