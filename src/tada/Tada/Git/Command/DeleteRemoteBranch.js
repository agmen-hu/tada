defineClass('Tada.Git.Command.DeleteRemoteBranch', 'Tada.Git.AbstractServerSideService',
  {
    delete: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo || !data.branch || !data.remote) {
        resultCallback("Missing repo, branch or remote request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      repo.push(data.remote, ":" + data.branch, function(err, success) {
        if (err) {
          resultCallback(err);
          return;
        }

        resultCallback(undefined, success);
      });

    }
  }
);
