defineClass('Tada.Git.Dialog.ShowVersionControlSummary', 'Tada.Git.Dialog.DataFromModel',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
        responseTemplateId: 'Tada-Git-Dialog-ShowVersionControlSummary'
      }, options));
    },

    _renderRepository: function(name, data)
    {
      this.__base(name, data);
      this.__showHiddenGlobalLinks(data);
      this.__mentionRepoAndCurrentBranch(data.repo);
    },

    _processRepository: function(name)
    {
      var repo = this.get("git.project").getRepository(name);
      this._renderRepository(name, {
        repo: repo,
        titleLinks: [{
          sentence: "Run gitk",
          arguments: { "from repo <value>": name },
          referenceText: "Run gitk",
          autoExecute: true
        }],
        links: repo.getFileStatus().isDirty() ? [
          {
            sentence: "Show change summary",
            arguments: { "for repository <value>": name },
            referenceText: "Show change summary",
            autoExecute: true
          },
          {
            sentence: "Stash changes",
            arguments: { "in repo <value>": name },
            referenceText: "Stash changes",
            autoExecute: true
          },
          {
            sentence: "Run git gui",
            arguments: { "from repo <value>": name },
            referenceText: "Run git gui",
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
