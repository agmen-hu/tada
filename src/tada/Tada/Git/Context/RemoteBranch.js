defineClass('Tada.Git.Context.RemoteBranch', 'Tada.Git.Context.Branch',
  {
    isCastable: function(cls)
    {
      if (typeof cls == 'string') {
        cls = getClass(cls);
      }

      if (cls === getClass('Tada.Git.Context.Branch') || cls === getClass('Tada.Git.Context.RemoteBranch')) {
        return true;
      }

      return false;
    }
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', str)){
        return new Tada.Git.Context.RemoteBranch({name:str, container:container});
      }

      throw new Error('Repositories does not have any remote branch with ' + str + 'name');
    }
  }
);
