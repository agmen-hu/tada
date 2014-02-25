defineClass('Tada.Git.Command.Fetch', 'Tada.Git.AbstractServerSideService',
  {
    fetch: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo) {
        resultCallback("Missing repo request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      repo.fetch(function(err, success) {
        if (err) {
          resultCallback(err);
          return;
        }

        resultCallback(undefined, success);
      }, data.prune);

    }
  }
);
