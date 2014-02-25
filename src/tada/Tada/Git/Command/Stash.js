defineClass('Tada.Git.Command.Stash', 'Tada.Git.AbstractServerSideService',
  {
    stash: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);
      if (!data.repo) {
        resultCallback("Missing repo request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      if (data.option && ["pop", "drop", "apply"].indexOf(data.option) == -1) {
        resultCallback("Unacceptable stash option: " + data.option);
        return;
      }

      repo.stash(data.option, function(err, success) {
        if (err) {
          resultCallback(err);
          return;
        }

        resultCallback(undefined, success);
      });

    }
  }
);
