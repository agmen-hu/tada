defineClass('Tada.Git.Context.Repository', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').getRepository(str)){
        return new Tada.Git.Context.Repository({name:str, container:container});
      }
    }
  }
);
