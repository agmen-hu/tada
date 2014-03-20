defineClass('Tada.Git.Dialog.Branch.CreateAndSwitch', 'Tada.Git.Dialog.Branch.Switch',
  {
    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branchName = this.arguments.branch.value;

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: 'Already on <value>', arguments: { "<value>": branchName } } });
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
        if (typeof data == "string") {
          data = {
            err: data
          }
        }

        if (!data.err) {
          var branch = this._updateModel(repo, branchName);
        }


        this._renderRepository(repo.getName(), {
          message: {
            type: data.err ? this.__self.MESSAGE_ERROR : this.__self.MESSAGE_INFO,
            text: data.err ? JSON.stringify(data.err) :  "Switched branch."
          },
          titleLinks: (!data.err && repo.getFileStatus().isDirty()) ? [{
            sentence: "Run git gui",
            arguments: { "from repo <value>": repoName },
            referenceText: "git gui",
            autoExecute: true
          }] : null,
          branch: !data.err ? branch : undefined,
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
