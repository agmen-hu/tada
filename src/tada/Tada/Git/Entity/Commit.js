defineClass('Tada.Git.Entity.Commit', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base(options);
      this.requireProperty('hash');
    },

    getHash: function()
    {
      return this.hash;
    },

    getMessageSubject: function()
    {
      return this.messageSubject;
    },

    setMessageSubject: function(value)
    {
      this.messageSubject = value;
    },

    getMessageBody: function()
    {
      return this.messageBody;
    },

    setMessageBody: function(value)
    {
      this.messageBody = value;
    },

    getCreated: function()
    {
      return this.created;
    },

    setCreated: function(value)
    {
      if (!(value instanceof Date)) {
        value = new Date(Date.parse(value));
        if (value == "Invalid Date") {
          throw new Error('Commit must have a valid created date');
        }
      }

      this.created = value;
    },

    getAuthor: function()
    {
      return this.author;
    },

    setAuthor: function(value)
    {
      if (!(value instanceof getClass('Tada.Git.Entity.Author'))) {
        throw new Error('Commit must have author with type Tada.Git.Entity.Author');
      }

      this.author = value;
    },

    getBranches: function()
    {
      return this.branches;
    },

    setBranches: function(value)
    {
      if (!(value instanceof getClass('Consoloid.Entity.Repository'))) {
        throw new Error('Commit must have at least one branch with type Consoloid.Entity.Repository');
      }

      this.branches = value;
    }
  }
);
