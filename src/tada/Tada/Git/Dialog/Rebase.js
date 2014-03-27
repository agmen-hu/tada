defineClass('Tada.Git.Dialog.Rebase', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: "Tada-Git-Dialog-Rebase",
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
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
      this.startWithoutExpression();
    },

    _processRepository: function(repoName)
    {
      var
        repo = this.get('git.project').getRepository(repoName),
        branch = this.__getBranch(repo),
        branchName = branch ? branch.getName() : '',
        queue = this.get('git.repository.command.queues').getQueue(repoName);

      if (!branch) {
        return;
      }

      if (repo.getFileStatus().isDirty()) {
        this._renderRepository(repoName, {
          message: { type: this.__self.MESSAGE_ERROR, text: 'Repo has local changes, please commit or stash them' },
          links: [{
            sentence: "Stash changes",
            arguments: { "in repo <value>": repoName },
            referenceText: "Stash changes",
            autoExecute: true
          },
          {
            sentence: "Run git gui",
            arguments: { "from repo <value>": repoName },
            referenceText: "Run git gui",
            autoExecute: true
          }]
        });
        return;
      }

      if (repo.getCurrentBranch().getName() == branchName) {
        this._renderRepository(repoName, { message: { type: this.__self.MESSAGE_ERROR, text: 'Cannot rebase a branch to itself' } });
        return;
      }

      queue
        .rebase(function(err){
          if (!err || (typeof err == 'object' && !Object.keys(err).length)) {
            return;
          }
          var response = { message: { text: err } };
          queue.killQueue();
          if (typeof err == 'object' && Object.keys(err).length) {
            response.message.text = JSON.stringify(err);
          }

          if (response.message.text.indexOf("is up to date") !== -1) {
            response.message.type = this.__self.MESSAGE_INFO;

            var localBranch = repo.getCurrentBranch();
            if (localBranch.getUpstream() && localBranch.getUpstream().getLatestCommit().getHash() != localBranch.getLatestCommit().getHash()) {
              response.titleLinks = [ this.__pushCurrentBranchLink(repoName) ];
            }
          } else {
            response.message.type = this.__self.MESSAGE_ERROR;
          }

          this._renderRepository(repoName, response);
        }.bind(this), repoName, branch.getName())
        .refresh(function(err) {
          if (!err || (typeof err == 'object' && !Object.keys(err).length)) {
            err = undefined;
            this._mentionBranches(repo, branch);
          }

          if (typeof err == 'object' && Object.keys(err).length) {
            err = JSON.stringify(err);
          }

          this._renderRepository(repoName, {
            message: {
              text: err || "Rebase was successful",
              type: err ? this.__self.MESSAGE_ERROR : this.__self.MESSAGE_INFO,
            },
            branch: repo.getCurrentBranch(repoName),
            titleLinks: (!err && this.__decidePushActionVisibility(repo, branch)) ? [this.__pushCurrentBranchLink(repoName)] : null,
          });
        }.bind(this), repoName/*, ['localRefList']*/);
    },

    __getBranch: function(repo)
    {
      var
        branch,
        err;

      if (this.toUpstream) {
        branch = repo.getCurrentBranch().getUpstream();
        if (!branch) {
          err = 'Branch ' + repo.getCurrentBranch().getName() + ' does not have an upstream';
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
        this._renderRepository(repo.getName(), { message: { type: this.__self.MESSAGE_ERROR, text: err } });
      } else {
        return branch;
      }
    },

    _mentionBranches: function(repo, branch)
    {
      var currentBranch = repo.getCurrentBranch();

      currentBranch.mention();
      branch.mention();
    },

    __decidePushActionVisibility: function(repo, branch)
    {
      return repo.getCurrentBranch().getLatestCommit() != branch.getLatestCommit();
    },

    __pushCurrentBranchLink: function(repoName)
    {
      return {
        sentence: "Push current branch",
        arguments: { "repository <value>": repoName },
        referenceText: "Push current branch",
        autoExecute: true
      }
    }
  }
);
