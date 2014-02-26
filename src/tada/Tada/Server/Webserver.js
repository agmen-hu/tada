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
      if (this.env == "prod") {
        this.__loggingInProductionEnvironment();
      }
      this.__base();
    },

    __loggingInProductionEnvironment: function()
    {
      var minilogDefinition = this.container.getDefinition("minilog");
      minilogDefinition.options.console = false;
      minilogDefinition.options.path = "/tmp/tada-" + Math.random().toString(36).substring(7) + ".log";
      this.container.addDefinition("minilog", minilogDefinition);

      console.log('Log file: ' + minilogDefinition.options.path);
    }
  }
);
