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
      this.config.resourceLoader.resourceDirectories.unshift(this.tadaConfig.get('tadaRoot'));
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
