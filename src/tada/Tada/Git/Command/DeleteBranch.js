defineClass('Tada.Git.Command.DeleteBranch', 'Tada.Git.AbstractServerSideService',
  {
    delete: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo || !data.branch) {
        resultCallback("Missing repo or branch request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      repo.deleteBranch(data.branch, resultCallback, data.unmerged);
    }
  }
);
