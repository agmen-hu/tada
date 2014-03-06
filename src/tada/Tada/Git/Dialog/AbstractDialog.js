defineClass('Tada.Git.Dialog.AbstractDialog', 'Consoloid.Ui.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        requestedRepositories: [],
        responseTemplateId: 'Tada-Git-Dialog-AbstractDialog',
        shouldUpdateContext: true
      }, options));

      if (!this.repositoryTemplate && this.repositoryTemplateId) {
        this.__createRepositoryTemplate();
      } else  if (!this.repositoryTemplate){
        throw new Error('repositoryTemplateId or repositoryTemplate required property')
      }
    },

    __createRepositoryTemplate: function()
    {
      this.repositoryTemplate = this.create('Consoloid.Widget.JQoteTemplate', {
        id: this.repositoryTemplateId,
        container: this.container
      });
    },

    setup: function()
    {
      if (this.arguments.repo) {
        this.requestedRepositories = [ this.arguments.repo.value ];
        this.__mentionRepo(this.arguments.repo.value);
      } else {
        this.requestedRepositories = Object.keys(this.container.get('tada').getConfig('repositories'));
      }
    },

    __mentionRepo: function(repoName)
    {
      this.get("git.project").getRepository(repoName).mention();
    },

    render: function()
    {
      this.__base();
      this.__processRequestedRepositories();
    },

    __processRequestedRepositories: function()
    {
      this.requestedRepositories.forEach(function(name) {
        this._processRepository(name);
      }.bind(this));
    },

    _processRepository: function(name)
    {
      this._renderRepository(name, {});
    },

    _renderRepository: function(name, data)
    {
      data.name = name;
      this.response.find('div[data-repo-name="'+name+'"]')
        .empty()
        .jqoteapp(this.repositoryTemplate.get(), data);

      this.get('console').animateMarginTopIfNecessary(0);
    }
  },
  {
    MESSAGE_INFO: 1,
    MESSAGE_ERROR: 2
  }
);
