defineClass('Tada.Git.Command.DeleteRemoteBranch', 'Tada.Git.AbstractServerSideService',
  {
    delete: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.repo || !data.branch || !data.remote) {
        resultCallback("No repo, branch or remote was added");
        return;
      }

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
