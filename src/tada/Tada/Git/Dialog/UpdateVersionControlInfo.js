defineClass('Tada.Git.Dialog.UpdateVersionControlInfo', 'Tada.Git.Dialog.ShowVersionControlSummary',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(name)
    {
      var base = this.__base;
      this.get('git.repository.command.queues').getQueue(name).refresh((function() {
        base.apply(this, [name]);
      }).bind(this), name);
    },
  }
);
