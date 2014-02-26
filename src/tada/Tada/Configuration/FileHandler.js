defineClass('Tada.Configuration.FileHandler', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        projectPathPattern: '.tada/project.conf',
        pathModule: options.pathModule || require('path'),
        fsModule: options.fsModule || require('fs'),
        jsYaml: options.jsYaml || require('js-yaml')
      }, options));
    },

    getProjectPathPattern: function()
    {
      return this.projectPathPattern;
    },

    loadFrom: function(root)
    {
      var configPath = this.__findTadaConfigFile(root);
      return this.__createConfig(configPath);
    },

    __findTadaConfigFile: function(path)
    {
      if (this.fsModule.existsSync(path + '/' + this.projectPathPattern)) {
        return path + '/' + this.projectPathPattern;
      }

      var parent = path + '/..';
      if (!this.fsModule.existsSync(parent) || this.pathModule.normalize(parent) == '/') {
        throw new Error('Tada configuration file ' + this.projectPathPattern + ' was not found.');
      }

      return this.__findTadaConfigFile(parent);
    },

    __createConfig: function(path)
    {
      var
        content = this.fsModule.readFileSync(path, { encoding: 'utf8', flag: 'r' }),
        config = this.jsYaml.load(content, { strict: true });

      config.tadaRoot = this.pathModule.normalize(this.pathModule.dirname(path));

      return this.create('Tada.Configuration.Factory',{}).createObject(config);
    },

    saveTo: function(root, config)
    {
      var
        filePath = root + '/' + this.projectPathPattern,
        targetDir = this.pathModule.dirname(root + '/' + this.projectPathPattern),

      config = config.get('/');
      delete config['tadaRoot'];

      if (!this.fsModule.existsSync(targetDir)) {
        this.fsModule.mkdirSync(targetDir);
      }

      this.fsModule.writeFileSync(filePath, this.jsYaml.safeDump(config));
    }
  }
);
