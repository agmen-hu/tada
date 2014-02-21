defineClass('Tada.Git.Command.Checkout', 'Tada.Git.AbstractServerSideService',
  {
    checkout: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.branch) {
        resultCallback("Branch name is missing");
        return;
      }

      repo.checkout(data.branch, data.create ? ['-b'] : [], function(data){
        resultCallback(undefined, data);
      });
    }
  }
);
