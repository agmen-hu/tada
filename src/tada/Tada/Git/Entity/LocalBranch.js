defineClass('Tada.Git.Entity.LocalBranch', 'Tada.Git.Entity.Branch',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextCls: 'Tada.Git.Context.LocalBranch'
      }, options));
    },

    getUpstream: function()
    {
      return this.upstream;
    },

    setUpstream: function(branch)
    {
      if (!(branch instanceof getClass('Tada.Git.Entity.RemoteBranch'))) {
        throw new TypeError('Branch upstream must be a Tada.Git.Entity.RemoteBranch');
      }

      this.upstream = branch;
    },

    isSyncedWithUpstream: function()
    {
      if (!this.upstream) {
        throw new Error('Branch does not have upstream');
      }

      return this.getLatestCommit() == this.upstream.getLatestCommit();
    },

    getAheadFromUpstream: function()
    {
      return this.aheadFromUpstream;
    },

    setAheadFromUpstream: function(value)
    {
      this.aheadFromUpstream = value;
    },

    getBehindFromUpstream: function()
    {
      return this.behindFromUpstream;
    },

    setBehindFromUpstream: function(value)
    {
      this.behindFromUpstream = value;
    }
  }
);
