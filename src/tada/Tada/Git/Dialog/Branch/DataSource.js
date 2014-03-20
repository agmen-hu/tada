defineClass('Tada.Git.Dialog.Branch.DataSource', 'Consoloid.Ui.List.DataSource.Array',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        data: []
      }, options));

      this.buildData();
    },

    buildData: function()
    {
      this.__fillData();
      this._clearFilters();
    },

    __fillData: function(repoName)
    {
      this.namedBranchList = {};
      this.get('git.project').getRepositories().forEach(function(repo){
        if (repoName && repo.getName() != repoName) {
          return;
        }

        repo.getLocalBranches().forEach(function(branch){
          this.__addBranchToNamedBranchList(branch, repo);
        }.bind(this));
        repo.getRemoteBranches().forEach(function(branch){
          this.__addBranchToNamedBranchList(branch, repo);
        }.bind(this));
      }.bind(this));

      this.data = Object.keys(this.namedBranchList).map(function(branchName){ return this.namedBranchList[branchName]; }.bind(this));
      this.__sortBranches();
    },

    __addBranchToNamedBranchList: function(branch, repo)
    {
      if (!this.namedBranchList[branch.getName()]) {
        this.namedBranchList[branch.getName()] = [];
      }

      this.namedBranchList[branch.getName()].push({ repo: repo, branch:branch});
    },

    __sortBranches: function()
    {
      this.__sortRepos();
      this.data.sort(function(a, b){
        try {
          return b[0].branch.getLatestCommit().getCreated().getTime() - a[0].branch.getLatestCommit().getCreated().getTime();
        } catch(error) {
          if (!(error instanceof getClass("Tada.Git.Error.UserMessage"))) {
            throw(error);
          }

          return 1;
        }
      }.bind(this));
    },

    __sortRepos: function()
    {
      this.data.forEach(function(entities){
        entities.sort(function(a, b){
          try {
            return b.branch.getLatestCommit().getCreated().getTime() - a.branch.getLatestCommit().getCreated().getTime();
          } catch(error) {
            if (!(error instanceof getClass("Tada.Git.Error.UserMessage"))) {
              throw(error);
            }

            return 1;
          }
        });
      });
    },

    _setFilterValues: function(callback, filterValues)
    {
      if (filterValues['repo']) {
        this.__fillData(filterValues.repo);
      }

      this._clearFilters();

      if (filterValues['name']) {
        this.__filterData('__branchNameIsMatching', new RegExp(filterValues.name));
      }

      if ('local' in filterValues) {
        this.__filterData('__filterType', 'Tada.Git.Entity.LocalBranch');

      }

      if ('remote' in filterValues) {
        this.__filterData('__filterType', 'Tada.Git.Entity.RemoteBranch');
      }


      callback(undefined);
    },

    __filterData: function(matcherMethod, expectation)
    {
      var i = 0;
      while (i < this.filteredDataIndexes.length) {
        if (this[matcherMethod](this.data[this.filteredDataIndexes[i]], expectation)) {
          i++;
        } else {
          this.filteredDataIndexes.splice(i, 1);
        }
      }
    },

    __branchNameIsMatching: function(item, expectation)
    {
      return item[0].branch.getName().match(expectation);
    },

    __filterType: function(item, expectation)
    {
      return item[0].branch instanceof getClass(expectation);
    }
  }
);
