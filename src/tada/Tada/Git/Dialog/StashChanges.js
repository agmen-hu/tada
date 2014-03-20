defineClass('Tada.Git.Dialog.StashChanges', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo"
      }, options));
    },

    _processRepository: function(repo)
    {
      if (!this.get("git.project").getRepository(repo).getFileStatus().isDirty()) {
        this._renderRepository(repo, {
          message: { text: "There were no local changes to stash", type: this.__self.MESSAGE_INFO },
          branch: this.get("git.project").getRepository(repo).getCurrentBranch()
        });
        return;
      }
      this.get('git.repository.command.queues').getQueue(repo).stash((function(err) {
        if (err) {
          this._renderRepository(repo, { message: { type: this.__self.MESSAGE_ERROR, text: err } });
          return;
        }

        this.__updateModelAfterStash(repo);
        this._renderRepository(repo, {
          message: { text: "Succesfully stashed changes", type: this.__self.MESSAGE_INFO },
          links: [{
            sentence: "Restore changes from stash",
            arguments: { "in repo <value>": repo },
            referenceText: "Restore changes from stash",
            autoExecute: true
          }],
          branch: this.get("git.project").getRepository(repo).getCurrentBranch()
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
