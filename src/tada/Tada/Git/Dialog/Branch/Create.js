defineClass('Tada.Git.Dialog.Branch.Create', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      var repository = this.get('git.project').getRepository(repoName);
      if (repository.getLocalBranches().hasEntity(this.arguments.branch.value)) {
        this._renderRepository(repoName, {
          message: {
            text: "Branch already exists",
            type: this.__self.MESSAGE_ERROR,
          },
          branch: repository.getLocalBranches().getEntity(this.arguments.branch.value),
          links: this.__createLinks(repository)
        });
        return;
      }

      this.get('git.repository.command.queues').getQueue(repoName).createBranch((function(err) {
        if (err) {
          this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: err } });
          return;
        }

        this._renderRepository(repoName, {
          branch: this.__createBranchEntity(repository),
          links: this.__createLinks(repository)
        });

      }).bind(this), repoName, this.arguments.branch.value);
    },

    __createBranchEntity: function(repository)
    {
      var branch = repository.getLocalBranches().createEntity({
        name: this.arguments.branch.value,
        commits: [repository.getCurrentBranch().getLatestCommit()],
      });
      branch.mention();
      return branch;
    },

    __createLinks: function(repository)
    {
      var result = [];
      this.__checkForRemotes(repository).forEach((function(remote) {
        result.push({
          sentence: "Add upstream",
          arguments: {
            "upstream <value>": remote.getName(),
            "to <value>": this.arguments.branch.value
          },
          referenceText: "Add upstream: " + remote.getName(),
          autoExecute: true
        })
      }).bind(this));

      return result;
    },

    __checkForRemotes: function(repository)
    {
      var result = [];
      repository.getRemoteBranches().forEach((function(branch) {
        if (branch.getLocalName() == this.arguments.branch.value) {
          result.push(branch);
        }
      }).bind(this));

      return result;
    }
  }
);
