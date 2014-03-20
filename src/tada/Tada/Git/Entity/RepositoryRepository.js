defineClass('Tada.Git.Entity.RepositoryRepository', 'Consoloid.Entity.Repository',
  {
    _updateEntityObject: function(entity, data)
    {
      data = $.extend(true, {}, data);
      if (data.remotes) {
        entity.getRemotes().update(this.__mapRemotes(data.remotes));
      }

      if (data.authors) {
        entity.getAuthors().update(data.authors);
      }

      if (data.commits) {
        entity.getCommits().update(this.__mapCommit(entity, data.commits));
      }

      if (data.remoteBranches) {
        entity.getRemoteBranches().update(this.__mapRemoteBranches(entity, data.remoteBranches));
      }

      if (data.branches) {
        entity.getLocalBranches().update(this.__mapBranches(entity, data.branches, data.status));
      }

      if (data.status) {
        this.__setCurrentBranch(entity, data.status.branch);
        this.__setFileStatus(entity, data.status);
      }
    },

    __mapRemotes: function(remotes)
    {
      return Object.keys(remotes).map(function(name){
        return { name: name, url: remotes[name] };
      });
    },

    __mapCommit: function(entity, commits)
    {
      return commits.map(function(commit) {
        commit.author = entity.getAuthors().getEntity(commit.author);
        return commit;
      });
    },

    __mapRemoteBranches: function(entity, branches)
    {
      return branches.map(function(branch){
        branch.commits = [ entity.getCommits().getEntity(branch.lastCommit) ];
        return branch;
      });
    },

    __mapBranches: function(entity, branches, status)
    {
      if (branches.length == 0 && status) {
        branches.push({
          name: status.branch.name
        })
      }

      return branches.map(function(branch){
        branch.commits = [];
        if (branch.lastCommit) {
          branch.commits.push(entity.getCommits().getEntity(branch.lastCommit));
        }

        if (branch.upstream) {
          branch.upstream = entity.getRemoteBranches().getEntity(branch.upstream);
        } else {
          delete branch['upstream'];
        }

        return branch;
      });
    },

    __setCurrentBranch: function(entity, branchData)
    {
      if (!branchData || branchData.name.length == "") {
        return;
      }

      var currentBranch = entity.getLocalBranches().getEntity(branchData.name);
      entity.setCurrentBranch(currentBranch);

      if (branchData.status && branchData.status[0]) {
        var status = branchData.status[0];
        if (status.type == 'ahead') {
          currentBranch.setAheadFromUpstream(status.commits);
        } else if (status.type == 'behind') {
          currentBranch.setBehindFromUpstream(status.commits);
        }
      }
    },

    __setFileStatus: function(entity, status)
    {
      var fileStatus = entity.getFileStatus();

      if (status.staged) {
        fileStatus.setStaged(status.staged);
      }

      if (status.not_staged) {
        fileStatus.setNotStaged(status.not_staged);
      }

      if (status.untracked) {
        fileStatus.setUntracked(status.untracked);
      }
    }
  }
);
