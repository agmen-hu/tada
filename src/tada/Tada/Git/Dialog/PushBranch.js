defineClass('Tada.Git.Dialog.PushBranch', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      if (!this.__repoHasBranch(repoName)) {
        this._renderRepository(repoName, { message: { text: "Repository does not have this branch.", type: this.__self.MESSAGE_ERROR } });
        return;
      }
      if (!this.__pushIsNeeded(repoName)) {
        this._renderRepository(repoName, { message: { text: "Push is not necessary.", type: this.__self.MESSAGE_ERROR } });
        return;
      }
      this.get('git.repository.command.queues').getQueue(repoName).push((function(err) {
        if (err) {
          this._renderRepository(repoName, { message: { text: err, type: this.__self.MESSAGE_ERROR } });
          return;
        }
        var repo = this.get("git.project").getRepository(repoName);
        this.__updateModelAndContextAfterPush(repoName);
        this._renderRepository(repoName, {
          message: {
            type: this.__self.MESSAGE_INFO,
            text: "Push was successful"
          },
          repo: repo,
          titleLinks: [{
            sentence: "Run gitk",
            arguments: { "from repo <value>": repoName },
            referenceText: "Run gitk",
            autoExecute: true
          }],
          branch: repo.getCurrentBranch()
        });
      }).bind(this), repoName, this.__getTargetRemote(repoName), this.__getTargetBranch(repoName));
    },

    __repoHasBranch: function(repoName)
    {
      return this.get("git.project").getRepository(repoName).getLocalBranches().hasEntity(this.__getTargetBranch(repoName));
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
