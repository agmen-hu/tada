defineClass('Tada.Git.Command.Rebase', 'Tada.Git.AbstractServerSideService',
  {
    rebase: function(res, data)
    {
      var
        $this = this,
        repo = this.getRepository(data.repo),
        resultCallback = this.__getResultCallback(res);
      if (!data.repo || !data.branch) {
        resultCallback("No repo or branch was added");
        return;
      }

      repo.rebase(data.branch, function(err, output) {
        if (!err && output.split('\n').some(function(line){
              return line.indexOf('Patch failed at') === 0 ||
                line.indexOf('Cannot rebase') === 0 ||
                line.indexOf('Current branch') === 0; }))
        {
          err = output;
        }

        resultCallback(err);
      });
    }
  }
);
