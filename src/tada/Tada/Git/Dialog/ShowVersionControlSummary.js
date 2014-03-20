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
        message: this.__getMessage(repo),
        links: this.__getLinks(repo, name),
        branch: !this.__getMessage(repo) ? repo.getCurrentBranch() : undefined
      });
    },

    __getMessage: function(repo)
    {
      if (repo.hasCurrentBranch() && repo.getCurrentBranch().getCommits().length != 0) {
        return undefined;
      }

      if (!repo.hasCurrentBranch()) {
        return {
          text: "Repository is in detached head state.",
          type: this.__self.MESSAGE_ERROR
        };
      }

      return {
        text: "Branch <branch> does not have any commits.",
        arguments: { "<branch>": repo.getCurrentBranch().getName() }
      };
    },

    __getLinks: function(repo, name)
    {
      var links = [];
      if (repo.getFileStatus().isDirty()) {
        links.push({
          sentence: "Show change summary",
          arguments: { "for repository <value>": name },
          referenceText: "Show change summary",
          autoExecute: true
        });
        links.push({
          sentence: "Stash changes",
          arguments: { "in repo <value>": name },
          referenceText: "Stash changes",
          autoExecute: true
        });
      }

      if (repo.getFileStatus().isDirty() || (repo.hasCurrentBranch() &&  repo.getCurrentBranch().getCommits().length == 0)) {
        links.push({
          sentence: "Run git gui",
          arguments: { "from repo <value>": name },
          referenceText: "Run git gui",
          autoExecute: true
        });
      }

      return links;
    },

    __showHiddenGlobalLinks: function(data)
    {
      if (data.repo.hasCurrentBranch() && data.repo.getCurrentBranch().getAheadFromUpstream()) {
        this.response.find('.git-globalpush').removeClass("git-hidden");
      }
      if (data.repo.getFileStatus().isDirty()) {
        this.response.find('.git-globalstash').removeClass("git-hidden");
      }
    },

    __mentionRepoAndCurrentBranch: function(repo)
    {
      repo.mention();
      if (repo.hasCurrentBranch()) {
        repo.getCurrentBranch().mention();
      }
    }

  }
);
