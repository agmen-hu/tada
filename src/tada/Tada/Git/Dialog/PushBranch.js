defineClass('Tada.Git.Dialog.PushBranch', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-PushRepo",
      }, options));
    },

    _processRepository: function(repo)
    {
      if (!this.__pushIsNeeded(repo)) {
        this._renderRepository(repo, { error: "Push is not necessary." });
        return;
      }
      this.get('git.repository.command.queues').getQueue(repo).push((function(err) {
        if (err) {
          this._renderRepository(repo, { error: err });
          return;
        }

        this.__updateModelAndContextAfterPush(repo);
        this._renderRepository(repo, {
          message: "Push was successful",
          repo: this.get("git.project").getRepository(repo)
        });
      }).bind(this), repo, this.__getTargetRemote(repo), this.__getTargetBranch(repo));
    },

    __pushIsNeeded: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);

      if (!this.__remoteBranch(repo)) {
        return true;
      }

      return this.__localBranch(repo).getLatestCommit() != this.__remoteBranch(repo).getLatestCommit();
    },

    __localBranch: function(repo)
    {
      return repo.getLocalBranches().getEntity(this.__getTargetBranch(repo.getName()));
    },

    __remoteBranch: function(repo)
    {
      var localBranch = this.__localBranch(repo);
      if (localBranch.getUpstream()) {
        return localBranch.getUpstream();
      }

      var remoteBranchName = "origin/" + this.__getTargetBranch(repo.getName());
      if (repo.getRemoteBranches().hasEntity(remoteBranchName)) {
        return repo.getRemoteBranches().getEntity(remoteBranchName);
      }

      return null;
    },

    __updateModelAndContextAfterPush: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);
      var commits = this.__localBranch(repo).getCommits();
      if (!this.__remoteBranch(repo)) {
        repo.getRemoteBranches().createEntity({ name: "origin/" + this.__getTargetBranch(repo.getName()) });
      }
      this.__remoteBranch(repo).setCommits(commits.slice());
      this.__localBranch(repo).mention();
    },

    __getTargetRemote: function(repoName)
    {
      var repo = this.get("git.project").getRepository(repoName);
      var remoteBranch = this.__remoteBranch(repo);
      if (remoteBranch) {
        return remoteBranch.getRemoteName();
      }

      return "origin";
    },

    __getTargetBranch: function(repo)
    {
      if (this.arguments.branch) {
        return this.arguments.branch.value
      }
      return this.get("git.project").getRepository(repo).getCurrentBranch().getName()
    }
  }
);
