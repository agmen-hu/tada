defineClass('Tada.Git.Dialog.RestoreStash', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RestoreStash"
      }, options));
    },

    _processRepository: function(repo)
    {
      var queue = this.get('repository.command.queues').getQueue(repo).createChildQueue();
      queue
        .stash(function(err) {
          if (err) {
            this._renderRepository(repo, { error: err });
            return queue.killQueue();
          }
        }.bind(this), repo, this.arguments.drop ? "pop" : "apply")
        .refresh(function(err) {
          if (err) {
            this._renderRepository(repo, { error: err });
            return queue.killQueue();
          }
          this._renderRepository(repo, { isDirty: this.get("git.project").getRepository(repo).getFileStatus().isDirty() });
        }.bind(this), repo, ["status"]);
    }
  }
);
