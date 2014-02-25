defineClass('Tada.Git.Command.CreateBranch', 'Tada.Git.AbstractServerSideService',
  {
    branch: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo || !data.branch) {
        resultCallback("Missing repo or branch request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      repo.branch(data.branch, function(err, success) {
        if (err) {
          resultCallback(err);
          return;
        }

        resultCallback(undefined, success);
      });

    }
  }
);
