defineClass('Tada.Usage.DialogLauncher', 'Consoloid.Interpreter.DialogLauncher',
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
        var action = encodeURIComponent(options.sentence.getExpressions()[0].getText())
        this.__analyticsAction('send', 'pageview', action);
        this.__analyticsAction('send', 'event', 'inputSource', action, this.nextInputSource || "keyboard");
        this.__sendNotClearEventIfNeeded(options);

        this.nextInputSource = "keyboard";
      }

      this.__base(options);
    },

    __sendNotClearEventIfNeeded: function(options)
    {
      if (
          options.sentence.service == "default_ambiguousity_avoider_dialog" ||
          options.sentence.service == "default_fallback_dialog"
          ) {
        var
          action = options.sentence.service.split("_")[1];
        this.__analyticsAction(
            'send',
            'event',
            'notClearSentence',
            action,
            action + ": " + options.arguments.text
          );
      }
    },

    __analyticsAction: function()
    {
      this.get('logger').log('info', 'UsageStatistics: The following Google Analytics action was made', {
        arguments: arguments,
      });
      googleAnalytics.apply(global, arguments);
    },

    setNextInputSource: function(inputSource)
    {
      if (["keyboard", "mic", "expression-reference"].indexOf(inputSource) == -1) {
        throw new Error("Invalid input type f usage statistics event, inputSource=" + inputSource);
      }

      this.nextInputSource = inputSource;
    }
  }
);