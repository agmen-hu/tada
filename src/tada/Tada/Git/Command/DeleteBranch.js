defineClass('Tada.Git.Command.DeleteBranch', 'Tada.Git.AbstractServerSideService',
  {
    delete: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.branch) {
        resultCallback("Branch name is missing");
        return;
      }

      repo.deleteBranch(data.branch, resultCallback, data.unmerged);
    }
  }
);
