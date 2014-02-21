defineClass('Tada.Git.Dialog.Rebase', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: "Tada-Git-Dialog-Rebase",
        repositoryTemplateId: "Tada-Git-Dialog-RebaseRepo",
      }, options));
    },

    start: function(args, expression)
    {
      this.toUpstream = false;
      this.__base(args, expression);
    },

    startWithUpstream: function(args, expression)
    {
      this.toUpstream = true;
      this.handleArguments(args, expression);
      this.setup(args, expression);
      this.render();
    },

    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branch = this.__getBranch(repo),
        branchName = branch ? branch.getName() : '';

      if (!branch) {
        return;
      }

      if (repo.getFileStatus().isDirty()) {
        this._renderRepository(repoName, {error: 'Repo has local changes, please commit or stash them'});
        return;
      }

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, {error: 'Cannot rebase a branch to itself'});
        return;
      }

      this.get('repository.command.queues').getQueue(repoName).rebase(function(err){
        if (!err || (typeof err == 'object' && !Object.keys(err).length)) {
          err = undefined;
          this._updateModel(repo, branch);
        }

        this._renderRepository(repoName, {error: err, repo: repo, isShowPush: this.__decidePushActionVisibility(err, repo, branch) });
      }.bind(this), repoName, branch.getName());
    },

    __getBranch: function(repo)
    {
      var
        branch,
        err;

      if (this.toUpstream) {
        branch = repo.getCurrentBranch().getUpstream();
        if (!branch) {
          err = 'Branch ' + repo.getCurrentBranch().getName() + ' does not has upstream';
        }
      } else {
        var branchName = this.arguments.branch.value;

        if (repo.hasRemoteBranch(branchName)) {
          branch = repo.getRemoteBranches().getEntity(branchName);

        } else if (repo.hasLocalBranch(branchName)) {
          branch = repo.getLocalBranches().getEntity(branchName);

        } else  {
          err = 'Branch ' + branchName + ' does not exist';
        }
      }

      if (!branch) {
        this._renderRepository(repo.getName(), {error: err});
      } else {
        return branch;
      }
    },

    _updateModel: function(repo, branch)
    {
      var currentBranch = repo.getCurrentBranch();
      branch.setCommits(currentBranch.getCommits().concat(branch.getCommits()));

      currentBranch.mention();
      branch.mention();
    },

    __decidePushActionVisibility: function(err, repo, branch)
    {
      var errorIsRequire = err && typeof err == 'string' && err.indexOf('Current branch') === 0;

      if (!errorIsRequire) {
        return false;
      }

      return repo.getCurrentBranch().getLatestCommit() != branch.getLatestCommit();
    }
  }
);
