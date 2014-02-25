defineClass('Tada.Git.Dialog.WelcomeMessage', 'Tada.Git.Dialog.UpdateVersionControlInfo',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    start: function()
    {
      this.setup();
      this.render();
    },

    setup: function()
    {
      this.arguments = {};
      this.__base();
      this.name = this.container.get('tada').getConfig('server/name');
      this.node = this.get('console').createNewDialog(this);
    },

    render: function()
    {
      this.node.empty().jqoteapp(this.template.get(), this);

      this.response = this.node.find('div.response');
      this.response.empty().jqoteapp(this.responseTemplate.get(), this);
      this._animateDialogShowup();
      this._bindEventListeners();

      document.title = this.name + " - Consoloid Tada";
      this.__processRequestedRepositories();
    },
  }
);
