defineClass('Tada.Git.Dialog.DataFromServer', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
      }, options));

      this.requireProperty('remoteMethod');
    },

    _processRepository: function(name)
    {
      this.get(this.remoteService).callAsync(this.remoteMethod, [ this.__generateRequestArguments(name) ], {
        success: function(result) {
          this._renderRepository(name, result);
        }.bind(this)
      });
    },

    __generateRequestArguments: function(repositoryName)
    {
      var
        expressionArgs = this.arguments,
        requestArgs = {};

      Object.keys(this.arguments).forEach(function(argName){
        requestArgs[argName] = expressionArgs[argName].value;
      });

      requestArgs.repo = repositoryName;
      return requestArgs;
    }
  }
);
