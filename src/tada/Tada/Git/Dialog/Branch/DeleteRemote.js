defineClass('Tada.Git.Dialog.Branch.DeleteRemote', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-Branch-DeleteRemoteRepo",
      }, options));
    },

    _processRepository: function(repo)
    {
      var splittedBranchName = this.arguments.branch.value.split("/");
      if (!this.__deleteIsPossible(repo)) {
        this._renderRepository(repo, {
          error: "Remote branch: " + this.arguments.branch.value + " does not exist.",
          repo: this.get("git.project").getRepository(repo)
        });
        return;
      }
      this.get('repository.command.queues').getQueue(repo).deleteRemoteBranch(
        (function(err) {
          if (err) {
            this._renderRepository(repo, { error: err });
            return;
          }
          if (this.arguments.deleteLocal && this.__hasLocalBranch(repo)) {
            this.__deleteLocalAfterRemoval(repo, splittedBranchName[1]);
            return;
          }
          this.__appendAfterRemoval(repo);
        }).bind(this),
        repo,
        splittedBranchName[0],
        splittedBranchName[1]
      );
    },

    __hasLocalBranch: function(repoName)
    {
      var localBranchName = this.arguments.branch.value.split("/")[1];
      return this.get("git.project").getRepository(repoName).getLocalBranches().hasEntity(localBranchName);
    },

    __deleteLocalAfterRemoval: function(repo, branchname)
    {
      this.get('repository.command.queues').getQueue(repo).deleteLocalBranch(
        (function(err) {
          if (err) {
            this._renderRepository(repo, { error: err });
            return;
          }
          this.__appendAfterRemoval(repo)
        }).bind(this),
        repo,
        branchname
      );
    },

    __appendAfterRemoval: function(repo) {
      var response = {
        message: "Remove was successful",
        repo: this.get("git.project").getRepository(repo),
        branchName: this.arguments.branch.value
      }

      if (this.arguments.deleteLocal && !this.__hasLocalBranch(repo)) {
        response.localDidNotExist = true;
      }

      if (!this.arguments.deleteLocal && this.__hasLocalBranch(repo)) {
        response.localDoesExist = true;
      }

      this.__updateModelAndContextAfterRemove(repo);
      this._renderRepository(repo, response);
    },

    __deleteIsPossible: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);
      return repo.getRemoteBranches().hasEntity(this.arguments.branch.value);
    },

    __updateModelAndContextAfterRemove: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);
      repo.getRemoteBranches().removeEntity(this.arguments.branch.value);
      this.get("git.context.forgetter").remoteBranch(this.arguments.branch.value);

      var localBranchName = this.arguments.branch.value.split("/")[1];
      if (this.arguments.deleteLocal && this.__hasLocalBranch(repoName)) {
        repo.getLocalBranches().removeEntity(localBranchName);
        this.get("git.context.forgetter").localBranch(localBranchName);
      }
    }
  }
);
