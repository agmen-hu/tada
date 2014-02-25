defineClass('Tada.Git.Dialog.StashChanges', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-StashChanges"
      }, options));
    },

    _processRepository: function(repo)
    {
      if (!this.get("git.project").getRepository(repo).getFileStatus().isDirty()) {
        this._renderRepository(repo, {
          noLocalChange: true,
          repo: this.get("git.project").getRepository(repo)
        });
        return;
      }
      this.get('git.repository.command.queues').getQueue(repo).stash((function(err) {
        if (err) {
          this._renderRepository(repo, { error: err });
          return;
        }

        this.__updateModelAfterStash(repo);
        this._renderRepository(repo, {
          message: "Succesfully stashed changes",
          repo: this.get("git.project").getRepository(repo)
        });
      }).bind(this), repo);
    },

    __updateModelAfterStash: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);
      repo.getFileStatus().setStaged([]);
      repo.getFileStatus().setNotStaged([]);
    }
  }
);
