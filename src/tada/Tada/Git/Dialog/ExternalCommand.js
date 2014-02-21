defineClass('Tada.Git.Dialog.ExternalCommand', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base(options);

      this.requireProperty('commandName');
    },

    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        queue = this.get('repository.command.queues').getQueue(repoName).createChildQueue();

      queue
        .runExternalCommand(function(err){
          if ((typeof err == 'object' && Object.keys(err).length) || (typeof err == 'string' && err)) {
            this._renderRepository(repoName, { error: err });
            return queue.killQueue();
          }

          if (!this.refreshIsNeeded) {
            this._renderRepository(repoName, {});
            return queue.killQueue();
          }
        }.bind(this), repoName, this.commandName)
        .refresh(function(err){
          if ((typeof err == 'object' && Object.keys(err).length) || (typeof err == 'string' && err)) {
            this._renderRepository(repoName, { error: err });
            return queue.killQueue();
          }

          this._renderRepository(repoName, { repo: repo});
        }.bind(this), repoName/*, ['status', 'localRefList', 'remoteRefList']*/);
    }
  }
);
