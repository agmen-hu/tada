defineClass('Tada.Git.Dialog.Branch.CreateAndSwitch', 'Tada.Git.Dialog.Branch.Switch',
  {
    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, {error: 'Already on ' + branchName});
        return;
      }

      this.isNew = true;

      if (repo.branchIsExists(branchName)) {
        this.isNew = false;

        if (!repo.hasLocalBranch(branchName)) {
          this.createFromRemote = true;
        }
      }

      this.get('git.repository.command.queues').getQueue(repoName).checkout(function(data){
        if (!data.err) {
          var branch = this._updateModel(repo, branchName);
        }
        this._renderRepository(repo.getName(), {error: data.err, branch: branch, repo: repo});
      }.bind(this), repoName, branchName, this.isNew);
    },

    _updateModel: function(repo, branchName)
    {
      var
        branch;

      if (this.isNew) {
        branch = this.__createLocalBranch(repo, branchName);

      } else if (this.createFromRemote) {
        branch = this._createLocalBranchFromRemote(repo, branchName);

      } else {
        branch = repo.getLocalBranches().getEntity(branchName);
      }

      repo.setCurrentBranch(branch);

      branch.mention();

      return branch;
    },

    __createLocalBranch: function(repo, branchName)
    {
      return repo.getLocalBranches().createEntity({
        name: branchName,
        commits: [ repo.getCurrentBranch().getLatestCommit() ]
        });
    }
  }
);
