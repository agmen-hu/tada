defineClass('Tada.Git.BranchSentenceArgumentValidator', 'Consoloid.Base.Object',
  {
    validateRepoAndBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var repoEntity = this.get('git.project').getRepository(arguments.repo.value);
      return repoEntity.branchIsExists(arguments.branch.value);
    },

    __repoAndBranchArgumentsPresent: function(arguments)
    {
      if (!arguments.repo || !arguments.repo.entity) {
        return false;
      }

      if (!arguments.branch || !arguments.branch.entity) {
        return false;
      }

      return true;
    },

    validateRepoAndLocalOrRemoteBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var
        repoEntity = this.get('git.project').getRepository(arguments.repo.value),
        branch = arguments.branch.value;

      return repoEntity.hasRemoteBranch(branch) || repoEntity.hasLocalBranch(branch);
    },

    validateRepoAndLocalBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var
        repoEntity = this.get('git.project').getRepository(arguments.repo.value),
        branch = arguments.branch.value;

      return repoEntity.hasLocalBranch(branch);
    },

    validateRepoAndRemoteBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var
        repoEntity = this.get('git.project').getRepository(arguments.repo.value),
        branch = arguments.branch.value;

      return repoEntity.hasRemoteBranch(branch);
    },

    validateRepoCurrentBranchHasUpstream: function(arguments)
    {
      if (!arguments.repo || !arguments.repo.entity) {
        return true;
      }

      var repoEntity = this.get('git.project').getRepository(arguments.repo.value);
      return repoEntity.getCurrentBranch().getUpstream() ? true : false;
    }
  }
)
