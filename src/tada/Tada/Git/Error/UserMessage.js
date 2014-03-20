defineClass('Tada.Git.Error.UserMessage', 'Consoloid.Base.Object',
{
  __constructor: function(options)
  {
    this.__base(options);
    this.requireProperty('message');
  },

  toString: function()
  {
    return this.message;
  }
});
