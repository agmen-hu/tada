defineClass('Tada.Git.Dialog.Branch.Delete', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-Branch-DeleteRepo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, {error: 'Cannot delete ' + branchName + ' branch, because you are on it!'});
        return;
      }

      if (!repo.hasLocalBranch(branchName)) {
       this._renderRepository(repoName, {error: 'Branch ' + branchName + ' does not exist!'});
        return;
      }

      var upstream = repo.getLocalBranches().getEntity(branchName).getUpstream();
      this.get('git.repository.command.queues').getQueue(repoName).deleteLocalBranch(function(err){
        err = err ? (typeof err == 'string' ? err : (Object.keys(err).length ? err : undefined)) : err;
        if (!err) {
          this._updateModel(repo, branchName);
        }

        this._renderRepository(repo.getName(), {error: err, branchName: branchName, repo: repo, upstreamName: upstream ? upstream.getName() : '' });
      }.bind(this), repoName, branchName, this.arguments.unmerged && this.arguments.unmerged.value);
    },

    _updateModel: function(repo, branchName)
    {
      repo.getLocalBranches().removeEntity(branchName);
      this.container.get('git.context.forgetter').localBranch(branchName);
    }
  }
);
