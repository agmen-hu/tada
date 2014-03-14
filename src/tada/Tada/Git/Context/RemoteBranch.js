defineClass('Tada.Git.Context.RemoteBranch', 'Tada.Git.Context.Branch',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', str)){
        return new Tada.Git.Context.RemoteBranch({name:str, container:container});
      }

      throw new Error(__('Repositories do not have any remote branch called <str>', {'<str>': str}));
    }
  }
);
