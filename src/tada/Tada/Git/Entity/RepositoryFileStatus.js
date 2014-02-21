defineClass('Tada.Git.Entity.RepositoryFileStatus', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        staged: [],
        notStaged: [],
        untracked: []
      }, options));
    },

    isDirty: function()
    {
      return this.staged.length || this.notStaged.length;
    },

    getStaged: function()
    {
      return this.staged;
    },

    setStaged: function(files)
    {
      this.staged = files;
    },

    getNotStaged: function()
    {
      return this.notStaged;
    },

    setNotStaged: function(files)
    {
      this.notStaged = files;
    },

    getUntracked: function()
    {
      return this.untracked;
    },

    setUntracked: function(files)
    {
      this.untracked = files;
    }
  }
);
