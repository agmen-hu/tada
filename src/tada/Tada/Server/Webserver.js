require('consoloid-server/Consoloid/Server/Webserver');
defineClass('Tada.Server.Webserver', 'Consoloid.Server.Webserver',
  {
    __constructor: function(options)
    {
      this.pathModule = require('path');

      this.__base(options);

      this.requireProperty('tadaConfig');
    },

    __createConfig: function()
    {
      this.__base();

      this.container.addSharedObject('tada_config', this.tadaConfig);
      this.config.server.port = this.tadaConfig.get('server/port');

      this.__addResourceDirectories();
    },

    __addResourceDirectories: function()
    {
      var theme = this.tadaConfig.get('theme') || "vanda";
      this.tadaDirectories = [
        "themes/" + theme,
        this.tadaConfig.get('tadaRoot') + "/themes/" + theme,
        this.tadaConfig.get('tadaRoot')
      ];

      this.tadaDirectories.forEach(function(directory) {
        this.config.resourceLoader.resourceDirectories.unshift(directory);
      }.bind(this));
    },

    run: function()
    {
      this.__base();

      this.tadaDirectories.forEach(function(directory) {
        this.setAsStaticDirectory(directory);
      }.bind(this));
    },

    __flushBootLogs: function()
    {
      if (this.env == "prod" && this.logFile) {
        this.__redirectConsoleLogToFile();
      }
      this.__base();
    },

    __redirectConsoleLogToFile: function()
    {
      var minilogDefinition = this.container.getDefinition("minilog");
      minilogDefinition.options.console = false;
      minilogDefinition.options.path = this.logFile;
      this.container.addDefinition("minilog", minilogDefinition);
    }
  }
);
