defineClass('Tada.Git.Context.LocalBranch', 'Tada.Git.Context.Branch',
  {
    isCastable: function(cls)
    {
      if (typeof cls == 'string') {
        cls = getClass(cls);
      }

      if (cls === getClass('Tada.Git.Context.Branch') || cls === getClass('Tada.Git.Context.LocalBranch')) {
        return true;

      } else if (cls == getClass('Tada.Git.Context.SwitchTargetBranch')) {
        return this.container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', this.toString());
      }

      return false;
    }
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', str)){
        return new Tada.Git.Context.LocalBranch({name:str, container:container});
      }

      throw new Error('Repositories does not have any local branch with ' + str + 'name');
    }
  }
);
