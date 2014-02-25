defineClass('Tada.Git.Command.Rebase', 'Tada.Git.AbstractServerSideService',
  {
    rebase: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);
      if (!data.repo || !data.branch) {
        resultCallback("Missing repo or branch request argument");
        return;
      }

      var repo = this.getRepository(data.repo);
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
