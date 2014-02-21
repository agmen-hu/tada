defineClass('Tada.Git.AbstractServerSideService', 'Consoloid.Server.Service',
  {
     __constructor: function(options)
    {
      this.__base($.extend({
          git: require('gitty')
        }, options));
    },

    getRepository: function(name)
    {
      var
        repositoryNames = this.get('tada_config').get('repositories', {});

      if (!repositoryNames[name]) {
        throw this.create('Consoloid.Error.UserMessage', { message: 'Repository not found:' + name});
      }

      var
        repo = this.git(repositoryNames[name]);

      if (!repo.isRepository) {
       throw new Error('This is not a git repository: ' + name + '(' + repositoryNames[name] + ')');
      }

      return repo;
    },

    __getResultCallback: function(res)
    {
      return function(err, data)
      {
        if (err) {
          this.sendError(res, err);
        } else {
          this.sendResult(res, data || {});
        }
      }.bind(this);
    }
  }
);
