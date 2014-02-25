defineClass('Tada.Git.Dialog.RestoreStash', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo"
      }, options));
    },

    _processRepository: function(repo)
    {
      var queue = this.get('git.repository.command.queues').getQueue(repo).createChildQueue();
      queue
        .stash(function(err) {
          if (err) {
            this._renderRepository(repo, { message: { error: true, text: err } });
            return queue.killQueue();
          }
        }.bind(this), repo, this.arguments.drop ? "pop" : "apply")
        .refresh(function(err) {
          if (err) {
            this._renderRepository(repo, { message: { error: true, text: err } });
            return queue.killQueue();
          }
          this._renderRepository(repo, {
            message: { text: "Restored stash"},
            links: this.get("git.project").getRepository(repo).getFileStatus().isDirty() ? [{
              sentence: "Show change summary",
              arguments: { "for repository <value>": repo },
              referenceText: "Show change summary",
              autoExecute: true
            }] : null,
          });
        }.bind(this), repo, ["status"]);
    }
  }
);
