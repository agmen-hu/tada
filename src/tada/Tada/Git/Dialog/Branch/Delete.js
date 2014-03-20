defineClass('Tada.Git.Dialog.Branch.Delete', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: 'Cannot delete <value> branch, because you are on it!', arguments: { '<value>': branchName } } });
        return;
      }

      if (!repo.hasLocalBranch(branchName)) {
       this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: 'Branch <value> does not exist!', arguments: { '<value>': branchName } } });
        return;
      }

      var upstream = repo.getLocalBranches().getEntity(branchName).getUpstream();
      this.get('git.repository.command.queues').getQueue(repoName).deleteLocalBranch(function(err){
        err = err ? (typeof err == 'string' ? err : (Object.keys(err).length ? err : undefined)) : err;
        if (!err) {
          this._updateModel(repo, branchName);
        }

        this._renderRepository(repo.getName(), {
          message: {
            type: err ? this.__self.MESSAGE_ERROR : this.__self.MESSAGE_INFO,
            text: err ? JSON.stringify(err) : "Branch " + branchName + "  successfully deleted."
          },
          links: (err && JSON.stringify(err).indexOf("not fully merged") != -1) ? [{
            sentence: "Delete branch",
            arguments: {
              "branch <value>": branchName,
              "from repo <value>": repo.getName(),
              "even if unmerged": true
            },
            referenceText: "Delete branch even if unmerged",
            autoExecute: true
          }] : (upstream ? [{
            sentence: "Delete remote branch",
            arguments: {
              "branch <value>": upstream.getName(),
              "from repo <value>": repo.getName(),
            },
            referenceText: "Delete remote branch " + upstream.getName(),
            autoExecute: true
          }] : []),
        });
      }.bind(this), repoName, branchName, this.arguments.unmerged && this.arguments.unmerged.value);
    },

    _updateModel: function(repo, branchName)
    {
      repo.getLocalBranches().removeEntity(branchName);
      this.container.get('git.context.forgetter').localBranch(branchName);
    }
  }
);
