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
      this.config.server.session.expressOptions.key = 'tada' + this.config.server.port;

      this.__addResourceDirectories();
    },

    __addResourceDirectories: function()
    {
      var theme = this.tadaConfig.get('theme') || "vanda";

      this.__checkForThemeDirectory(theme);

      this.tadaDirectories = [
        this.tadaConfig.get('tadaRoot'),
        this.tadaConfig.get('tadaRoot') + "/themes/" + theme,
        __dirname + "/../../../../themes/" + theme
      ];

      this.tadaDirectories.forEach(function(directory) {
        this.config.resourceLoader.resourceDirectories.unshift(directory);
      }.bind(this));
    },

    __checkForThemeDirectory: function(theme)
    {
      var fs = require('fs');

      if (!fs.existsSync(__dirname + "/../../../../themes/" + theme) && !fs.existsSync(this.tadaConfig.get('tadaRoot') + "/themes/" + theme)) {
        throw new Error("Theme folder for \"" + theme + "\" theme does not exist.");
      }
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
