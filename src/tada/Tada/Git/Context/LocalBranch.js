defineClass('Tada.Git.Context.LocalBranch', 'Tada.Git.Context.Branch',
  {
    isCastable: function(cls)
    {
      if (typeof cls == 'string') {
        cls = getClass(cls);
      }

      if (this.__base(cls)) {
        return true;
      }

      if (cls == getClass('Tada.Git.Context.SwitchTargetBranch')) {
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

      throw new Error(__('Repositories do not have any local branch called <str>', {'<str>': str}));
    }
  }
);
