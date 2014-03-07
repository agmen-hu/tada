defineClass('Tada.Git.DetectRepositories', 'Consoloid.Base.Object',
  {
     __constructor: function(options)
    {
      this.__base($.extend({
        glob: options.glob || require('glob'),
        pathModule: options.pathModule || require('path')
      }, options));
    },

    detect: function(cwd, callback)
    {
      var
        repositories = {},
        mainName = this.pathModule.basename(cwd);

      this.glob('**/.git', {cwd: cwd}, function(err, repositoryPaths){
        if (err) {
          callback(err);
          return;
        }

        repositoryPaths.forEach(function(repoPath){
          this.__storeRepository(mainName, repoPath, repositories);
        }, this);

        callback(undefined, repositories);
      }.bind(this));
    },

    __storeRepository: function(mainName, repoPath, repositories)
    {
      var
        splittedPath = repoPath.split('/');

      splittedPath.pop();

      if (!splittedPath.length) {
        repositories[mainName] = '.';
        return;
      }

      repositories[splittedPath[splittedPath.length - 1]] = splittedPath.join('/');
    }
  }
);