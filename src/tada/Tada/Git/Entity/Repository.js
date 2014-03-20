defineClass('Tada.Git.Entity.Repository', 'Consoloid.Entity.Mentionable',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextCls: 'Tada.Git.Context.Repository',
        authors: options.authors || this.create('Consoloid.Entity.Repository', {entityCls: 'Tada.Git.Entity.Author', idProperty: 'email', container: options.container}),
        remotes: options.remotes || this.create('Consoloid.Entity.Repository', {entityCls: 'Tada.Git.Entity.Remote', container: options.container}),
        commits: options.commits || this.create('Consoloid.Entity.Repository', {entityCls: 'Tada.Git.Entity.Commit', idProperty: 'hash', container: options.container}),
        localBranches: options.localBranches || this.create('Consoloid.Entity.Repository', {entityCls: 'Tada.Git.Entity.LocalBranch', container: options.container}),
        remoteBranches: options.remoteBranches || this.create('Consoloid.Entity.Repository', {entityCls: 'Tada.Git.Entity.RemoteBranch', container: options.container}),
        fileStatus: options.fileStatus || this.create('Tada.Git.Entity.RepositoryFileStatus', { container: options.container })
      }, options));

      this.requireProperty('name');
    },

    getName: function()
    {
      return this.name;
    },

    getAuthors: function()
    {
      return this.authors;
    },

    getRemotes: function()
    {
      return this.remotes;
    },

    getCommits: function()
    {
      return this.commits;
    },

    getFileStatus: function()
    {
      return this.fileStatus;
    },

    getLocalBranches: function()
    {
      return this.localBranches;
    },

    getRemoteBranches: function()
    {
      return this.remoteBranches;
    },

    branchExistsLocallyOrAtSomeRemote: function(branchName)
    {
      var found = this.localBranches.hasEntity(branchName);

      if (!found) {
        found = this.remoteBranches.some(function(branch){
          return branch.getLocalName() == branchName;
        });
      }

      return found;
    },

    hasLocalBranch: function(branchName)
    {
      return this.localBranches.hasEntity(branchName);
    },

    hasRemoteBranch: function(branchName)
    {
      return this.remoteBranches.hasEntity(branchName);
    },

    hasRemote: function(remoteName)
    {
      return this.remotes.hasEntity(remoteName);
    },

    setCurrentBranch: function(branch)
    {
      if (!(branch instanceof getClass('Tada.Git.Entity.LocalBranch'))) {
        throw new TypeError('Current branch must be a Tada.Git.Entity.LocalBranch');
      }

      this.currentBranch = branch;
    },

    getCurrentBranch: function()
    {
      if (!this.currentBranch) {
        getClass("Tada.Git.Error.UserMessage");
        throw new Tada.Git.Error.UserMessage({ message: "Repository is in detached head state." });
      }
      return this.currentBranch;
    },

    hasCurrentBranch: function()
    {
      return this.currentBranch ? true : false;
    }
  },
  {
    fromString: function(str, container)
    {
      return container.get('git.project').getRepository(str);
    }
  }
);
