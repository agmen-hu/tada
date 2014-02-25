defineClass('Tada.Git.Context.SwitchTargetBranch', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      if (container.get('git.project').callMethodOnReposUntilTrue('branchExistsLocallyOrAtSomeRemote', str)){
        return new Tada.Git.Context.SwitchTargetBranch({name:str, container:container});
      }

      throw new Error('Repositories does not have any branch with ' + str + 'name');
    }
  }
);
