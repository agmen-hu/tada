require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('consoloid-console/Consoloid/Ui/List/DataSource/Base');
require('consoloid-console/Consoloid/Ui/List/DataSource/Array');

require('../DataSource');
require('../../../Entity/Project');
require('../../../Entity/Repository');
require('../../../Entity/Commit');
require('../../../Entity/Branch');
require('../../../Entity/LocalBranch');
require('../../../Entity/RemoteBranch');
require('../../../Error/UserMessage');

describeUnitTest('Tada.Git.Dialog.Branch.DataSource', function() {
  var
    repoA, repoB,
    repoALocalBranches,
    repoARemoteBranches,
    repoBLocalBranches,
    repoBRemoteBranches,
    source;

  beforeEach(function() {
    repoALocalBranches = [];
    repoARemoteBranches = [];
    repoBLocalBranches = [];
    repoBRemoteBranches = [];

    repoA = env.mock('Tada.Git.Entity.Repository');
    repoA.getLocalBranches.returns(repoALocalBranches);
    repoA.getRemoteBranches.returns(repoARemoteBranches);

    repoB = env.mock('Tada.Git.Entity.Repository');
    repoB.getLocalBranches.returns(repoBLocalBranches);
    repoB.getRemoteBranches.returns(repoBRemoteBranches);

    var project = env.mock('Tada.Git.Entity.Project');
    project.getRepositories.returns([ repoA, repoB]);
    env.addServiceMock('git.project', project);
  });

  describe('#__constructor(options)', function(){
    var
      branchA,
      branchB;

    beforeEach(function(){
      branchA = env.mock('Tada.Git.Entity.LocalBranch');
      branchB = env.mock('Tada.Git.Entity.LocalBranch');

      branchA.getName.returns('foo');
      branchB.getName.returns('bar');

      var commit = env.mock('Tada.Git.Entity.Commit');
      commit.getCreated.returns(new Date('2014-02-13'));
      branchA.getLatestCommit.returns(commit);

      commit = env.mock('Tada.Git.Entity.Commit');
      commit.getCreated.returns(new Date('2014-02-14'));
      branchB.getLatestCommit.returns(commit);
    });

    it('should collect local branches from repositories and sort by commit date', function(){
      repoALocalBranches.push(branchA);
      repoBLocalBranches.push(branchB);

      source = env.create('Tada.Git.Dialog.Branch.DataSource', {});
      source.data[0].should.be.eql([{ branch: branchB, repo: repoB}]);
      source.data[1].should.be.eql([{ branch: branchA, repo: repoA}]);
    });

    it('should do the same things with the remote branches', function() {
      repoARemoteBranches.push(branchA);
      repoBRemoteBranches.push(branchA);

      source = env.create('Tada.Git.Dialog.Branch.DataSource', {});
      source.data.should.have.length(1);
      source.data[0].should.be.eql([{ branch: branchA, repo: repoA}, { branch: branchA, repo: repoB} ]);
    });

    it("should be able to work with branches that don't have any commits", function() {
      branchA.getLatestCommit.throws(new Tada.Git.Error.UserMessage({ message: "It could not deal with the error." }));
      branchB.getLatestCommit.throws(new Tada.Git.Error.UserMessage({ message: "It could not deal with the error." }));
      repoALocalBranches.push(branchA);
      repoBLocalBranches.push(branchB);

      source = env.create('Tada.Git.Dialog.Branch.DataSource', {});
    });
  });

  describe('#_setFilterValues(callback, filterValues)', function(){
    beforeEach(function(){
      var repos = env.container.get('git.project').getRepositories();
      repos[0].getName.returns('repoA');
      repos[1].getName.returns('repoB');

      repoALocalBranches.push(env.mock('Tada.Git.Entity.LocalBranch'));
      repoARemoteBranches.push(env.mock('Tada.Git.Entity.RemoteBranch'));
      repoBLocalBranches.push(env.mock('Tada.Git.Entity.LocalBranch'));
      repoBRemoteBranches.push(env.mock('Tada.Git.Entity.RemoteBranch'));

      repoALocalBranches[0].getName.returns('featureA');
      repoARemoteBranches[0].getName.returns('origin/featureA');
      repoBLocalBranches[0].getName.returns('featureB');
      repoBRemoteBranches[0].getName.returns('origin/featureA');

      var commit = env.mock('Tada.Git.Entity.Commit');
      commit.getCreated.returns(new Date('2014-02-13'));
      repoALocalBranches[0].getLatestCommit.returns(commit);
      repoARemoteBranches[0].getLatestCommit.returns(commit);
      repoBLocalBranches[0].getLatestCommit.returns(commit);
      repoBRemoteBranches[0].getLatestCommit.returns(commit);

      source = env.create('Tada.Git.Dialog.Branch.DataSource', {});
    });

    describe('repo filter', function(){
      it('should filter all branch when repo is not exists', function(){
        var callback = sinon.spy();

        source._setFilterValues(callback, { repo: 'alma'});

        callback.calledOnce.should.be.true;
        source.filteredDataIndexes.should.be.empty;
      });

      it('should filter branches which are dont belong to the repo', function(){
        source._setFilterValues(function(){}, { repo: 'repoA' });

        source.filteredDataIndexes.should.have.length(2);
        source.filteredDataIndexes[0].should.be.eql(0);
        source.filteredDataIndexes[1].should.be.eql(1);

        source.data.should.have.length(2);
        source.data[0].should.be.eql([{ branch: repoALocalBranches[0], repo: repoA}]);
        source.data[1].should.be.eql([{ branch: repoARemoteBranches[0], repo: repoA}]);
      });
    });

    it('should filter for local branch', function(){
      source._setFilterValues(function(){}, { local: true });

      source.filteredDataIndexes.should.have.length(2);
      source.filteredDataIndexes[0].should.be.eql(0);
      source.filteredDataIndexes[1].should.be.eql(2);
    });

    it('should filter for remote branch', function(){
      source._setFilterValues(function(){}, { remote: true });

      source.filteredDataIndexes.should.have.length(1);
      source.filteredDataIndexes[0].should.be.eql(1);
    });

    it('should filter for branch name with regexp', function(){
      source._setFilterValues(function(){}, { name: '^feat' });

      source.filteredDataIndexes.should.have.length(2);
      source.filteredDataIndexes[0].should.be.eql(0);
      source.filteredDataIndexes[1].should.be.eql(2);
    });
  });
});
