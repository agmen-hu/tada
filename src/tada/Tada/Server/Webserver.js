require('consoloid-server/Consoloid/Server/Webserver');
require('../Configuration');
defineClass('Tada.Server.Webserver', 'Consoloid.Server.Webserver',
  {
    __constructor: function(options)
    {
      this.pathModule = require('path');

      this.__base(options);
    },

    __createConfig: function()
    {
      this.__base();

      this.tadaConfig = this.create('Tada.Configuration', {
        container: this.container,
        searchFrom: process.cwd()
      });

      this.container.addSharedObject('tada_config', this.tadaConfig);
      this.config.server.port = this.tadaConfig.get('server/port');
      this.config.resourceLoader.resourceDirectories.unshift(this.tadaConfig.get('tadaRoot'));
    }
  }
);
