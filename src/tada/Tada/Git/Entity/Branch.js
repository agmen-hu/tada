defineClass('Tada.Git.Entity.Branch', 'Consoloid.Entity.Mentionable',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextCls: 'Tada.Git.Context.Branch'
      }, options));

      this.requireProperty('name');
    },

    getName: function()
    {
      return this.name;
    },

    setCommits: function(commits)
    {
      if (!commits) {
        throw new Error('setCommits method called without an array of commits');
      }

      commits.forEach(function(commit) {
        if (!(commit instanceof getClass('Tada.Git.Entity.Commit'))) {
          throw new Error('Branch commits with type Tada.Git.Entity.Commit');
        }
      });

      this.commits = commits;
    },

    getCommits: function()
    {
      return this.commits;
    },

    getLatestCommit: function()
    {
      if (!this.commits[0]) {
        getClass("Tada.Git.Error.UserMessage");
        throw new Tada.Git.Error.UserMessage({ message: "Branch does not have any commits." });
      }
      return this.commits[0];
    }
  }
);
