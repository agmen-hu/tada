defineClass('Tada.Git.Context.Repository', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').hasRepository(str)){
        return new Tada.Git.Context.Repository({name:str, container:container});
      }

      throw new Error(__('Project does not have any repository called <str>', {'<str>': str}));
    }
  }
);
