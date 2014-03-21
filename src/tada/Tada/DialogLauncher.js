defineClass('Tada.DialogLauncher', 'Consoloid.Interpreter.DialogLauncher',
  {
    createGoogleAnalyticsObjectAndSendFirstPageView: function()
    {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','googleAnalytics');

      this.__analyticsAction('create', this.googleAnalyticsAccountId, this.googleAnalyticsOptions);

      this.__analyticsAction('send', 'pageview', encodeURIComponent("welcomeMessage"));
    },

    __startDialog: function(options)
    {
      if (global.googleAnalytics) {
        this.__analyticsAction('send', 'pageview', encodeURIComponent(options.sentence.getExpressions()[0].getText()));

        if (
            options.sentence.service == "default_ambiguousity_avoider_dialog" ||
            options.sentence.service == "default_fallback_dialog"
            ) {
          this.__sendAnalyticsEvent(options);
        }
      }

      this.__base(options);
    },

    __sendAnalyticsEvent: function(options)
    {
      var
        action = options.sentence.service.split("_")[1];
      this.__analyticsAction(
          'send',
          'event',
          'notClearSentence',
          action,
          action + ": " + options.arguments.text
        );
    },

    __analyticsAction: function()
    {
      this.get('logger').log('info', 'UsageStatistics: The following Google Analytics action was made', {
        arguments: arguments,
      });
      googleAnalytics.apply(global, arguments);
    }
  }
);