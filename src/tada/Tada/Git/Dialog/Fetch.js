defineClass('Tada.Git.Dialog.Fetch', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: "Tada-Git-Dialog-Fetch",
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo"
      }, options));
    },

    _processRepository: function(repo)
    {
      if (this.get("git.project").getRepository(repo).getRemotes().getEntityCount() == 0) {
        this._renderRepository(repo, { message: { type: this.__self.MESSAGE_ERROR, text: "Repository has no remotes to fetch from" } });
        return;
      }

      var oldBrances = this.__extractBranchHashes(this.get("git.project").getRepository(repo));

      var queue = this.get('git.repository.command.queues').getQueue(repo).createChildQueue();
      queue
        .fetch(function(err){
          if(err) {
            this._renderRepository(repo, { message: { text: err, type: this.__self.MESSAGE_ERROR } });
            return queue.killQueue();
          }
        }.bind(this), repo, this.arguments.prune ? this.arguments.prune.value : false)
        .refresh(function(err){
          if(err) {
            this._renderRepository(repo, { message: { text: err, type: this.__self.MESSAGE_ERROR } });
            return queue.killQueue();
          }
          var changes = this.__getChanges(oldBrances, this.get("git.project").getRepository(repo));
          this._renderRepository(repo, {
            message: (changes.newBranches.length == 0 && changes.updatedBranches.length == 0 && changes.removedBranches.length == 0) ? {
              text: "No changes",
              type: this.__self.MESSAGE_INFO
            } : null,
            embed: {
              templateId: "#Tada-Git-Dialog-FetchRepo",
              data: changes
            }
          });
        }.bind(this), repo/*, ["remoteRefList"]*/);
    },

    __extractBranchHashes: function(repo)
    {
      var result = {};

      repo.getRemoteBranches().forEach(function(branch) {
        result[branch.getName()] = branch.getLatestCommit().getHash();
      });

      return result
    },

    __getChanges: function(oldRemoteBranches, repo)
    {
      var
        newRemoteBranches = this.__extractBranchHashes(repo),
        result = {
          removedBranches: [],
          updatedBranches: [],
          newBranches: [],
          repo: repo
        };

      result = this.__getRemovedAndupdatedBranches(result, oldRemoteBranches, newRemoteBranches);
      result = this.__getNewlyCreatedBranches(result, oldRemoteBranches, newRemoteBranches);
      this.__mentionAndForgetChanges(repo, result);
      return result;
    },

    __getRemovedAndupdatedBranches: function(result, oldRemoteBranches, newRemoteBranches)
    {
      $.each(oldRemoteBranches, function(oldBranchName, oldLatestCommit) {
        var
          found = false,
          changed = false;
        $.each(newRemoteBranches, function(newBranchName, newLatestCommit) {
          if (oldBranchName == newBranchName) {
            found = true;
            if (oldLatestCommit != newLatestCommit) {
              changed = true;
            }
          }
        });

        if (!found) {
          result.removedBranches.push(oldBranchName);
        }
        if (changed) {
          result.updatedBranches.push(oldBranchName);
        }
      });

      return result;
    },

    __getNewlyCreatedBranches: function(result, oldRemoteBranches, newRemoteBranches)
    {
      $.each(newRemoteBranches, function(newBranchName, newLatestCommit) {
        var found = false;
        $.each(oldRemoteBranches, function(oldBranchName, oldLatestCommit) {
          if (oldBranchName == newBranchName) {
            found = true;
          }
        });

        if (!found) {
          result.newBranches.push(newBranchName);
        }
      });

      return result;
    },

    __mentionAndForgetChanges: function(repo, result)
    {
      result.removedBranches.forEach((function(branchName) {
        this.container.get('git.context.forgetter').remoteBranch(branchName);
      }).bind(this));
      result.updatedBranches.concat(result.newBranches).forEach(function(branchName) {
        repo.getRemoteBranches().getEntity(branchName).mention();
      });
    }
  }
);
