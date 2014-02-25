defineClass('Tada.Git.Context.Branch', 'Consoloid.Context.Object',
  {
    isCastable: function(cls)
    {
      if (typeof cls == 'string') {
        cls = getClass(cls);
      }

      if (cls === getClass('Tada.Git.Context.LocalBranch')) {
        return this.container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', this.toString());

      } else if (cls === getClass('Tada.Git.Context.RemoteBranch')) {
        return this.container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', this.toString());
      }

      return false;
    }
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', str) ||
          container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', str))
      {
        return new Tada.Git.Context.Branch({name:str, container:container});
      }

      throw new Error('Repositories does not have any local or remote branch with ' + str + 'name');
    }
  }
);
