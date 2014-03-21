defineClass('Tada.Git.Dialog.WelcomeMessage', 'Tada.Git.Dialog.UpdateVersionControlInfo',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: "Tada-Dialog-WelcomeMessage",
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo"
      }, options));

      if (this.container.get('tada').getConfig('usageStatisticsEnabled')) {
        this.__manageUsageStatisticsCookie();
        this.get("dialogLauncher").createGoogleAnalyticsObjectAndSendFirstPageView();
      }
    },

    __manageUsageStatisticsCookie: function()
    {
      var match = decodeURIComponent(document.cookie).match('analytics_info_was_shown=([^\;]+)');
      if (!match || match[1] != "true") {
        document.cookie = "analytics_info_was_shown=true";
        this.showAnalyticsInfo = true;
      }
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
    }
  }
);
