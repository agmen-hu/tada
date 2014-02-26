defineClass('Tada.Git.Dialog.Branch.DeleteRemote', 'Tada.Git.Dialog.AbstractDialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(repoName)
    {
      this.repo = this.get("git.project").getRepository(repoName),
      this.remoteBranch = this.__getBranch();

      if (!this.remoteBranch) {
        this._renderRepository(repoName, {
          message: {
            error: true,
            text: __("Remote branch: <value> does not exist.", { "<value>": this.arguments.branch.value })
          }
        });
        return;
      }

      this.hasLocalBranch = this.repo.hasLocalBranch(this.remoteBranch.getLocalName());

      this.get('git.repository.command.queues').getQueue(repoName).deleteRemoteBranch(
        (function(err) {
          if (err) {
            this._renderRepository(repoName, { message: { error: true, text: err } });
            return;
          }
          if (this.arguments.deleteLocal && this.hasLocalBranch) {
            this.__deleteLocalAfterRemoval();
            return;
          }
          this.__appendAfterRemoval();
        }).bind(this),
        this.repo.getName(),
        this.remoteBranch.getRemoteName(),
        this.remoteBranch.getLocalName()
      );
    },

    __getBranch: function(repo, branchName)
    {
      var branchName = this.arguments.branch.value;
      if (this.repo.hasRemoteBranch(branchName)) {
        return this.repo.getRemoteBranches().getEntity(branchName);
      }
    },

    __deleteLocalAfterRemoval: function()
    {
      if (this.repo.getLocalBranches().getEntity(this.remoteBranch.getLocalName()) == this.repo.getCurrentBranch()) {
        this._renderRepository(repoName, {
          message: {
            error: true,
            text: __("Cannot delete local <value>  branch because you are currently on it.", { "<value>":  this.remoteBranch.getLocalName() })
          }
        });
        return;
      }

      this.get('git.repository.command.queues').getQueue(this.repo.getName()).deleteLocalBranch(
        (function(err) {
          if (err) {
            this._renderRepository(this.repo.getName(), { message: { error: true, text: err } });
            return;
          }
          this.__appendAfterRemoval()
        }).bind(this),
        this.repo.getName(),
        this.remoteBranch.getLocalName()
      );
    },

    __appendAfterRemoval: function() {
      var response = {
        message: {
          text: "Remove remote branch was successful.",
        }
      }

      if (this.arguments.deleteLocal && !this.hasLocalBranch) {
        response.message.text += " There wasn't any local branch named like this to remove."
      }

      if (!this.arguments.deleteLocal && this.hasLocalBranch) {
        response.links = [{
          sentence: "Delete branch",
          arguments: {
            "branch <value>": this.remoteBranch.getLocalName(),
            "from repo <value>": this.repo.getName()
          },
          referenceText: "Delete local branch",
          autoExecute: true
        }]
      }

      this.__updateModelAndContextAfterRemove();
      this._renderRepository(this.repo.getName(), response);
    },

    __updateModelAndContextAfterRemove: function()
    {
      this.repo.getRemoteBranches().removeEntity(this.remoteBranch.getName());
      this.get("git.context.forgetter").remoteBranch(this.remoteBranch.getName());

      var localBranchName = this.remoteBranch.getLocalName();
      if (this.arguments.deleteLocal && this.hasLocalBranch) {
        this.repo.getLocalBranches().removeEntity(localBranchName);
        this.get("git.context.forgetter").localBranch(localBranchName);
      }
    }
  }
);
