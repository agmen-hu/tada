defineClass('Tada.Git.Dialog.ShowVersionControlSummary', 'Tada.Git.Dialog.DataFromModel',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
        //repositoryTemplateId: "Tada-Git-Dialog-ShowVersionControlSummaryRepo",
        responseTemplateId: 'Tada-Git-Dialog-ShowVersionControlSummary'
      }, options));
    },

    _renderRepository: function(name, data)
    {
      this.__base(name, data);
      this.__showHiddenGlobalLinks(data);
      this.__mentionRepoAndCurrentBranch(data);
    },

    _processRepository: function(name)
    {
      var repo = this.get("git.project").getRepository(name);
      this._renderRepository(name, {
        repo: repo,
        titleLinks: [{
          startText: "Run gitk from " + name,
          linkText: "Run gitk",
          autoExecute: true
        }],
        links: repo.getFileStatus().isDirty() ? [
          {
            startText: "Show change summary for " + name,
            linkText: "Show change summary",
            autoExecute: true
          },
          {
            startText: "Stash changes in " + name,
            linkText: "Stash changes",
            autoExecute: true
          },
          {
            startText: "Run git gui from " + name,
            linkText: "Run git gui",
            autoExecute: true
          }
        ] : [],
        branch: repo.getCurrentBranch()
      });
    },

    __showHiddenGlobalLinks: function(data)
    {
      if (data.repo.getCurrentBranch().getAheadFromUpstream()) {
        this.response.find('.git-globalpush').removeClass("git-hidden");
      }
      if (data.repo.getFileStatus().isDirty()) {
        this.response.find('.git-globalstash').removeClass("git-hidden");
      }
    },

    __mentionRepoAndCurrentBranch: function(repo)
    {
      repo.mention();
      repo.getCurrentBranch().mention();
    }

  }
);
