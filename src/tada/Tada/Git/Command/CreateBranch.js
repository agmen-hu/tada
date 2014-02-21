defineClass('Tada.Git.Command.CreateBranch', 'Tada.Git.AbstractServerSideService',
  {
    branch: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.repo || !data.branch) {
        resultCallback("No repo or branch was added");
        return;
      }

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
