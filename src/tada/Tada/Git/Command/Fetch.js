defineClass('Tada.Git.Command.Fetch', 'Tada.Git.AbstractServerSideService',
  {
    fetch: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.repo) {
        resultCallback("No repo was added");
        return;
      }

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
