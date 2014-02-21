defineClass('Tada.Git.Entity.Author', 'Consoloid.Base.Object',
  {
    getName: function()
    {
      return this.name;
    },

    setName: function(value)
    {
      this.name = value;
    },

    getEmail: function()
    {
      return this.email;
    },

    setEmail: function(value)
    {
      this.email = value;
    }
  }
);
