defineClass('Tada.Git.Entity.Project', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryRepository: this.create('Tada.Git.Entity.RepositoryRepository', { entityCls: 'Tada.Git.Entity.Repository', container: options.container })
      }, options));

      this.__createEmptyRepositories();
    },

    __createEmptyRepositories: function()
    {
      var repos = this.container.get('tada').getConfig('repositories');
      for (var repo in repos) {
        this.__createRepository(repo, {});
      }
    },

    __createRepository: function(repo, data)
    {
      data.name = repo;
      this.repositoryRepository.createOrUpdateEntity(data);
    },

    getRepository: function(repoName)
    {
      return this.repositoryRepository.getEntity(repoName);
    },

    hasRepository: function(repoName)
    {
      return this.repositoryRepository.hasEntity(repoName);
    },

    getRepositories: function()
    {
      var repositories = [];
      this.repositoryRepository.forEach(function(repository) {
        repositories.push(repository);
      });
      return repositories;
    },

    update: function(repoName, repoData)
    {
      repoData.name = repoName;
      this.repositoryRepository.updateEntity(repoData);
    },

    callMethodOnReposUntilTrue: function(method, args)
    {
      var repos = this.getRepositories();
      return Object.keys(repos).some(function(repo){
        return repos[repo][method](args);
      });
    }
  }
);
