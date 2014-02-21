defineClass('Tada.Git.Context.Remote', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasRemote', str)){
        return new Tada.Git.Context.Remote({name:str, container:container});
      }

      throw new Error('Repositories does not have any remote with ' + str + 'name');
    }
  }
);
