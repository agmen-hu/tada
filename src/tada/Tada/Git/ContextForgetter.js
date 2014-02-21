defineClass('Tada.Git.ContextForgetter', 'Consoloid.Base.Object',
  {
    localBranch: function(name)
    {
      if (this.container.get('git.project').callMethodOnReposUntilTrue('hasLocalBranch', name)){
        return;
      }

      this.__forget('Tada.Git.Context.LocalBranch', name);
    },

    __forget: function(cls, name)
    {
      this.container.get('context').forget(cls, name);
    },

    remoteBranch: function(name)
    {
      if (this.container.get('git.project').callMethodOnReposUntilTrue('hasRemoteBranch', name)){
        return;
      }

      this.__forget('Tada.Git.Context.RemoteBranch', name);
    }
  }
)
