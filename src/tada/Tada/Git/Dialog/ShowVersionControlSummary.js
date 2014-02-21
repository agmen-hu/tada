defineClass('Tada.Git.Dialog.ShowVersionControlSummary', 'Tada.Git.Dialog.DataFromModel',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-ShowVersionControlSummaryRepo",
        responseTemplateId: 'Tada-Git-Dialog-ShowVersionControlSummary'
      }, options));
    },

    _renderRepository: function(name, data)
    {
      this.__base(name, data);
      this.__showHiddenGlobalLinks(data);
      this.__mentionRepoAndCurrentBranch(data);
    },

    __showHiddenGlobalLinks: function(data)
    {
      if (data.getCurrentBranch().getAheadFromUpstream()) {
        this.response.find('.git-globalpush').removeClass("git-hidden");
      }
      if (data.getFileStatus().isDirty()) {
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
