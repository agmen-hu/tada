defineClass('Tada.Git.Command.Checkout', 'Tada.Git.AbstractServerSideService',
  {
    checkout: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo || !data.branch) {
        resultCallback("Missing repo or branch request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
      repo.checkout(data.branch, data.create ? ['-b'] : [], function(data){
        resultCallback(undefined, data);
      });
    }
  }
);
