defineClass('Tada.Git.Command.ProcessFactory', 'Tada.Git.AbstractServerSideService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        commands: {}
      }, options));
    },

    execOnRepo: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo || !data.commandName) {
        resultCallback("Missing repo or commandName request argument");
        return;
      }

      var
        command = this.commands[data.commandName];

      if (!command) {
        throw new Error('Extrenal command not found: ' + data.commandName);
      }

      if (!command.command) {
        throw new Error('External comamnd "' + data.commandName + '" does not have command property');
      }

      var
        repo = this.getRepository(data.repo),
        process = this.create('Consoloid.OS.Process', {
          container: this.container,
          command: command.command,
          args: command.arguments || [],
          spawnOptions: {
            cwd: repo.path
          },
          onClose: resultCallback,
          onError: resultCallback
        });

      process.start();
    }
  }
);
