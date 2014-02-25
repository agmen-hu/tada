defineClass('Tada.Git.Dialog.Branch.Switch', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-Branch-SwitchRepo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      var
        forcedToMaster = false,
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, {error: 'Already on ' + branchName});
        return;
      }

      if (!repo.branchExistsLocallyOrAtSomeRemote(branchName)) {
        forcedToMaster = true;
        branchName = 'master';
      }

      this.get('git.repository.command.queues').getQueue(repoName).checkout(function(data){
        if (!data.err) {
          var branch = this._updateModel(repo, branchName);
        }
        this._renderRepository(repo.getName(), {error: data.err, branch: branch, repo: repo, forcedToMaster: forcedToMaster});
      }.bind(this), repoName, branchName);
    },

    _updateModel: function(repo, branchName)
    {
      var
        branch,
        localBranches = repo.getLocalBranches();

      if (localBranches.hasEntity(branchName)) {
        branch = localBranches.getEntity(branchName);
      } else {
        branch = this._createLocalBranchFromRemote(repo, branchName);
      }

      repo.setCurrentBranch(branch);

      branch.mention();

      return branch;
    },

    _createLocalBranchFromRemote: function(repo, branchName)
    {
      var remoteBranch;
      repo.getRemoteBranches().some(function(branch){
        if (branch.getLocalName() == branchName) {
          remoteBranch = branch;
          return true;
        }
      });

      return repo.getLocalBranches().createEntity({
        name: branchName,
        upstream: remoteBranch,
        commits: [ remoteBranch.getLatestCommit() ]
      });
    }
  }
);
