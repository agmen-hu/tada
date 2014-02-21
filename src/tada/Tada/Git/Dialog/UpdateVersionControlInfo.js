defineClass('Tada.Git.Dialog.UpdateVersionControlInfo', 'Tada.Git.Dialog.ShowVersionControlSummary',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-ShowVersionControlSummaryRepo",
      }, options));
    },

    _processRepository: function(name)
    {
      this.get('repository.command.queues').getQueue(name).refresh((function() {
        this._renderRepository(name, this.get("git.project").getRepository(name));
      }).bind(this), name);
    },
  }
);
