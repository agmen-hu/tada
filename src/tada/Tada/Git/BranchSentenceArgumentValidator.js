defineClass('Tada.Git.BranchSentenceArgumentValidator', 'Consoloid.Base.Object',
  {
    validateRepoAndBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var repoEntity = this.get('git.project').getRepository(arguments.repo.value);
      if (repoEntity.branchExistsLocallyOrAtSomeRemote(arguments.branch.value)) {
        return true;
      };

      throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
        message: __('Repo called <repo> does not have branch called <branch>', {"<repo>": arguments.repo.value, "<branch>": arguments.branch.value}),
        arguments: ['branch', 'repo']
      });
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

      if (repoEntity.hasRemoteBranch(branch) || repoEntity.hasLocalBranch(branch)) {
        return true;
      };

      throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
        message: __('Repo called <repo> does not have local or remote branch called <branch>', {"<repo>": arguments.repo.value, "<branch>": arguments.branch.value}),
        arguments: ['branch', 'repo']
      });
    },

    validateRepoAndLocalBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var
        repoEntity = this.get('git.project').getRepository(arguments.repo.value),
        branch = arguments.branch.value;

      if (repoEntity.hasLocalBranch(branch)) {
        return true;
      };

      throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
        message: __('Repo called <repo> does not have local branch called <branch>', {"<repo>": arguments.repo.value, "<branch>": arguments.branch.value}),
        arguments: ['branch', 'repo']
      });
    },

    validateRepoAndRemoteBranch: function(arguments)
    {
      if (!this.__repoAndBranchArgumentsPresent(arguments)) {
        return true;
      }

      var
        repoEntity = this.get('git.project').getRepository(arguments.repo.value),
        branch = arguments.branch.value;

      if (repoEntity.hasRemoteBranch(branch)) {
        return true;
      };

      throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
        message: __('Repo called <repo> does not have remote branch called <branch>', {"<repo>": arguments.repo.value, "<branch>": arguments.branch.value}),
        arguments: ['branch', 'repo']
      });
    },

    validateRepoCurrentBranchHasUpstream: function(arguments)
    {
      if (!arguments.repo || !arguments.repo.entity) {
        return true;
      }

      var repoEntity = this.get('git.project').getRepository(arguments.repo.value);

      if (!repoEntity.hasCurrentBranch()) {
        throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
          message: __('Repo called <repo> is in detached head state', {"<repo>": arguments.repo.value}),
          arguments: ['repo']
        });
      }

      if (repoEntity.getCurrentBranch().getUpstream()) {
        return true;
      };

      throw new (getClass('Consoloid.Interpreter.InvalidArgumentsError'))({
        message: __('Current branch of repo called <repo> does not have an upstream', {"<repo>": arguments.repo.value}),
        arguments: ['repo']
      });
    }
  }
)
