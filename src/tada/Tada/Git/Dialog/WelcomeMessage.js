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

    setup: function()
    {
      this.__base();
      this.name = this.container.get('tada').getConfig('server/name');
    },

    render: function()
    {
      this.__base();

      document.title = this.name + " - Consoloid Tada";
      this.__processRequestedRepositories();
    }
  }
);
