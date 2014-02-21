defineClass('Tada.Configuration', 'Consoloid.Base.DeepAssoc',
  {
    __constructor: function(options)
    {
      this.pathModule = require('path');
      this.fsModule = require('fs');

      this.__base($.extend({
        value: {
          server: {
            port: 3500
          }
        }
      }, options));
      this.requireProperty('searchFrom');

      this.__findTadaConfigFile(this.searchFrom);
      this.__readTadaConfigFile();
    },

    __findTadaConfigFile: function(path)
    {
      if (this.fsModule.existsSync(path + '/.tada/project.conf')) {
        this.tadaConfigFile = path + '/.tada/project.conf';
        return;
      }

      var parent = path + '/..';
      if (!this.fsModule.existsSync(parent) || this.pathModule.normalize(parent) == '/') {
        throw new Error('Tada configuration file .tada/project.conf was not found.');
      }

      this.__findTadaConfigFile(parent);
    },

    __readTadaConfigFile: function()
    {
      var content = this.fsModule.readFileSync(this.tadaConfigFile, { encoding: 'utf8', flag: 'r' });
      this.merge(require('js-yaml').load(content, { strict: true }));
      this.set('tadaRoot', this.pathModule.dirname(this.tadaConfigFile));
    },

    getTadaConfigFile: function()
    {
      return this.tadaConfigFile;
    }
  }
);