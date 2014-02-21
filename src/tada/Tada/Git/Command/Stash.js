defineClass('Tada.Git.Command.Stash', 'Tada.Git.AbstractServerSideService',
  {
    stash: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.repo) {
        resultCallback("No repo was added");
        return;
      }

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
