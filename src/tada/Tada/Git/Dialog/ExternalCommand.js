defineClass('Tada.Git.Dialog.ExternalCommand', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base(options);

      this.requireProperty('commandName');
    },

    _processRepository: function(repoName)
    {
      this.get('git.command.external').callAsync(
        'execOnRepo',
        [ { repo: repoName, commandName: this.commandName } ],
        {
          success: (function() {
            if (this.refreshIsNeeded) {
              this.__refresh(repoName);
              return;
            }

            this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_INFO, text: "Requested external command finished." } });
          }).bind(this),
          error: (function(err) {
            this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: err } });
          }).bind(this)
      },
      86400000);
    },

    __refresh: function(repoName) {
      var
        repo = this.get('git.project').getRepository(repoName),
        queue = this.get('git.repository.command.queues').getQueue(repoName).createChildQueue();

      queue.refresh(function(err){
        if ((typeof err == 'object' && Object.keys(err).length) || (typeof err == 'string' && err)) {
          this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR,  text: err } });
          return queue.killQueue();
        }

        this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_INFO, text: "Requested external command finished." },  branch: repo.getCurrentBranch() });
      }.bind(this), repoName/*, ['status', 'localRefList', 'remoteRefList']*/);
    }
  }
);
