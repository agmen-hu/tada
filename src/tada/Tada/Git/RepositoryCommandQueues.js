defineClass('Tada.Git.RepositoryCommandQueues', 'Consoloid.Base.Object',
  {
     __constructor: function(options)
    {
      this.__base($.extend({
        commandQueues: {},
      }, options));

      this.__createQueues();
    },

    __createQueues: function()
    {
      var repos = this.container.get('tada').getConfig('repositories');
      for (var repo in repos) {
        this.commandQueues[repo] = this.create('Tada.Git.CommandQueue', { container: this.container });
      }
    },

    getQueue: function(repo)
    {
      return this.commandQueues[repo];
    },
  }
);
