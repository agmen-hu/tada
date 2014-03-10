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
      if (!commits || !commits[0] || !(commits[0] instanceof getClass('Tada.Git.Entity.Commit'))) {
        throw new Error('Branch must have at least one commit with type Tada.Git.Entity.Commit');
      }

      this.commits = commits;
    },

    getCommits: function()
    {
      return this.commits;
    },

    getLatestCommit: function()
    {
      return this.commits[0];
    }
  }
);
