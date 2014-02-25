defineClass('Tada.Git.Dialog.Branch.CreateAndSwitch', 'Tada.Git.Dialog.Branch.Switch',
  {
    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, { message: { error: true, text: __('Already on <value>', { "<value>": branchName }) } });
        return;
      }

      this.isNew = true;

      if (repo.branchExistsLocallyOrAtSomeRemote(branchName)) {
        this.isNew = false;

        if (!repo.hasLocalBranch(branchName)) {
          this.createFromRemote = true;
        }
      }

      this.get('git.repository.command.queues').getQueue(repoName).checkout(function(data){
        if (!data.err) {
          var branch = this._updateModel(repo, branchName);
        }


        this._renderRepository(repo.getName(), {
          message: {
            error: data.err ? { fromGit: true } : null,
            text: data.err ? JSON.stringify(data.err) :  "Switched branch."
          },
          titleLinks: (!data.err && repo.getFileStatus().isDirty()) ? [{
            sentence: "Run git gui",
            arguments: { "from repo <value>": repoName },
            referenceText: "git gui",
            autoExeceute: true
          }] : null,
          branch: branch,
        });

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
