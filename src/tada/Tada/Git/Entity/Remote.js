defineClass('Tada.Git.Entity.Remote', 'Consoloid.Entity.Mentionable',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextCls: 'Tada.Git.Context.Remote'
      }, options));

      this.requireProperty('name');
    },

    getName: function()
    {
      return this.name;
    },

    getUrl: function()
    {
      return this.url;
    },

    setUrl: function(value)
    {
      this.url = value;
    }
  }
);
