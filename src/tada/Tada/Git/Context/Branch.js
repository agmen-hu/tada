defineClass('Tada.Git.Context.Branch', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', str) ||
          container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', str))
      {
        return new Tada.Git.Context.Branch({name:str, container:container});
      }

      throw new Error(__('Repositories do not have any local or remote branch called <str>', {'<str>': str}));
    }
  }
);
