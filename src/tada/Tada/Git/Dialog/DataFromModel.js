defineClass('Tada.Git.Dialog.DataFromModel', 'Tada.Git.Dialog.AbstractDialog',
  {
    _processRepository: function(name)
    {
      this._renderRepository(name, this.get("git.project").getRepository(name));
    },
  }
);
