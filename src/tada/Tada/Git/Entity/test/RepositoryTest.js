require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Repository');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('../Branch');
require('../RemoteBranch');
require('../Repository');
require('../RepositoryFileStatus');
require('../../Error/UserMessage');

describeUnitTest('Tada.Git.Enttiy.Repository', function() {
  var
    repository;

  beforeEach(function(){
    repository = env.create('Tada.Git.Entity.Repository', {
      name: 'tada',
      remotes: env.mock('Consoloid.Entity.Repository'),
      commits: env.mock('Consoloid.Entity.Repository'),
      localBranches: env.mock('Consoloid.Entity.Repository'),
      remoteBranches: env.mock('Consoloid.Entity.Repository'),
      fileStatus: env.mock('Tada.Git.Entity.RepositoryFileStatus')
    })
  });

  describe('#branchExistsLocallyOrAtSomeRemote(branchName)', function(){
    it('should return true when repos has local branch',function() {
      repository.getLocalBranches().hasEntity.returns(true);
      repository.branchExistsLocallyOrAtSomeRemote('master').should.be.true;
    });

    describe('when repo does not have local branch with the given name', function(){
      beforeEach(function(){
        repository.getLocalBranches().hasEntity.returns(false);

        var remoteBranch = env.mock('Tada.Git.Entity.RemoteBranch');
        remoteBranch.getName.returns('origin/master');
        repository.getRemoteBranches().some.callsArgWith(0, remoteBranch);
      });

      it('should return true when repo has remotebranch without remote name', function(){
        repository.getRemoteBranches().some.returns(true);

        repository.branchExistsLocallyOrAtSomeRemote('master').should.be.true;

        repository.getRemoteBranches().some.alwaysReturned(true).should.be.true;
      });

      it('should return false when repo deos not have', function(){
        repository.getRemoteBranches().some.returns(false);

        repository.branchExistsLocallyOrAtSomeRemote('foo').should.be.false;

        repository.getRemoteBranches().some.alwaysReturned(false).should.be.true;
      });
    });
  });

  describe('#hasLocalBranch(branchName)', function(){
    it('should return wheter the repo has or not has the branch',function() {
      repository.getLocalBranches().hasEntity.returns(true);
      repository.hasLocalBranch('master').should.be.true;

      repository.getLocalBranches().hasEntity.returns(false);
      repository.hasLocalBranch('foo').should.be.false;
    });
  });

  describe('#hasRemoteBranch(branchName)', function(){
    it('should return wheter the repo has or not has the remote branch',function() {
      repository.getRemoteBranches().hasEntity.returns(true);
      repository.hasRemoteBranch('origin/master').should.be.true;

      repository.getRemoteBranches().hasEntity.returns(false);
      repository.hasRemoteBranch('foo').should.be.false;
    });
  });

  describe('#hasRemote(remoteName)', function(){
    it('should return wheter the repo has or not has remote',function() {
      repository.getRemotes().hasEntity.returns(true);
      repository.hasRemote('origin').should.be.true;

      repository.getRemotes().hasEntity.returns(false);
      repository.hasRemote('foo').should.be.false;
    });
  });

  describe("#getCurrentBranch()", function() {
    it('should throw Tada.Git.Error.UserMessage if repository does not have a current branch', function() {
      (function() {
        repository.getCurrentBranch();
      }).should.throwError(Tada.Git.Error.UserMessage);
    });
  });

});
