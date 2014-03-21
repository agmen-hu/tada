require('consoloid-server/Consoloid/Server/Webserver');
require('../Configuration/Factory');
require('../Configuration/FileHandler');
require('../Git/DetectRepositories');
defineClass('Tada.Command.Detect', 'Consoloid.Base.Object',
  {
     __constructor: function(options)
    {
      this.__base($.extend({
        glob: options.glob || require('glob'),
        pathModule: options.pathModule || require('path'),
        configFactory: options.configFactory || this.create('Tada.Configuration.Factory', {}),
        configFileHandler: options.configFileHandler || this.create('Tada.Configuration.FileHandler', {}),
        fsModule: options.fsModule || require('fs'),
        pathModule: options.pathModule || require('path')
      }, options));
    },

    start: function(cwd, callback)
    {
      var config =  this.__getCurrentConfig(cwd);

      this.__askServerPort(config, function(config){
        this.__detectGitRepositories(config, callback);
      }.bind(this));
    },

    __getCurrentConfig: function(cwd)
    {
      try {
        var config = this.configFileHandler.loadFrom(cwd);
        config.set('cwd', this.pathModule.normalize(config.get('tadaRoot') + '/..'));
        console.log('Existing tada project found in: ' + config.get('tadaRoot'));
        return config;
      } catch(e) {
        this.newConfigFile = true;
        return this.configFactory.createObject({
          cwd: cwd,
          tadaRoot: this.pathModule.dirname(cwd + '/' + this.configFileHandler.getProjectPathPattern()),
          server: {
            name: this.pathModule.basename(cwd)
          },
          usageStatisticsEnabled: true
        });
      }
    },

    __askServerPort: function(config, callback)
    {
      var
        stdin = process.stdin,
        stdout = process.stdout;

      stdin.resume();
      stdout.write('Which port would you like to use (current: ' + config.get('server/port') + '): ');

      stdin.once('data', function(data) {
        data = data.toString().trim();

        if (!data || data.match(/^\d+$/)) {
          if (data) {
            config.set('server/port', data);
          }
          callback(config);
        } else {
          stdout.write('Should only use numbers\n');
          this.__askServerPort(config, callback);
        }
      }.bind(this))
    },

    __detectGitRepositories: function(config, callback)
    {
      console.log('Searching git repositories under ' + config.get('cwd'));
      this.create('Tada.Git.DetectRepositories', {}).detect(config.get('cwd'), function(err, repositories){
        if (err) {
          callback(err)
          return;
        }

        if (!Object.keys(repositories).length) {
          callback('Search hasn\'t found any git repository, exiting...');
          return;
        }

        config.set('repositories', repositories);
        this.__logFoundRepositories(repositories);
        this.__saveConfig(config);
        callback(undefined, config);

      }.bind(this));
    },

    __logFoundRepositories: function(repositories)
    {
      Object.keys(repositories).forEach(function(repoName){
        console.log('Added repository found at ' + repositories[repoName] + ' with name ' + repoName + '.');
      });
    },

    __saveConfig: function(config)
    {
      var cwd = config.get('cwd');
      config.remove('cwd');

      this.configFileHandler.saveTo(cwd, config);
      this.__createGitIgnoreFile(cwd);

      console.log('Configuration was written to ' + (cwd + '/' + this.configFileHandler.getProjectPathPattern()) + '.');
    },

    __createGitIgnoreFile: function(cwd)
    {
      if (!this.newConfigFile) {
        return;
      }

      var configDir = cwd + '/' + this.pathModule.dirname(this.configFileHandler.getProjectPathPattern());
      this.fsModule.writeFileSync(configDir + '/.gitignore', 'themes\n' + this.pathModule.basename(this.configFileHandler.getProjectPathPattern()) + '.local\n');
    }
  }
)
