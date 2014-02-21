defineClass('Tada.Git.Entity.RemoteBranch', 'Tada.Git.Entity.Branch',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextCls: 'Tada.Git.Context.RemoteBranch'
      }, options));

      this.__setNameParts();
    },

    __setNameParts: function()
    {
      var
        separatorIndex = this.name.indexOf('/');

      this.localName = this.name.substr(separatorIndex + 1);
      this.remoteName = this.name.substr(0, separatorIndex);
    },

    getLocalName: function()
    {
      return this.localName;
    },

    getRemoteName: function()
    {
      return this.remoteName;
    }
  }
);
