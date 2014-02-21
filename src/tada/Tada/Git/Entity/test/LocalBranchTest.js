require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('../Commit');
require('../Branch');
require('../RemoteBranch');
require('../LocalBranch');

describeUnitTest('Tada.Git.Entity.LocalBranch', function() {
  var
    branch,
    commit1,
    commit2,
    upstream;

  beforeEach(function(){
    commit1 = env.mock('Tada.Git.Entity.Commit');
    commit2 = env.mock('Tada.Git.Entity.Commit');
    upstream = env.mock('Tada.Git.Entity.RemoteBranch');
  });

  describe('#setUpstream(branch)', function(){
    beforeEach(function(){
      branch = new Tada.Git.Entity.LocalBranch({ name: 'foo', commits: [commit1]});
    });

    it('should throw when branch is not a remote branch', function(){
      (function(){ branch.setUpstream(undefined) }).should.throw('Branch upstream must be a Tada.Git.Entity.RemoteBranch');
      (function(){ branch.setUpstream('alma') }).should.throw('Branch upstream must be a Tada.Git.Entity.RemoteBranch');
      (function(){ branch.setUpstream(env.mock('Tada.Git.Entity.Branch')) }).should.throw('Branch upstream must be a Tada.Git.Entity.RemoteBranch');
    });

    it('should set when branch is remote branch', function(){
      branch.setUpstream(upstream);
      branch.getUpstream().should.be.eql(upstream);
    });
  });

  describe('#isSyncedWithUpstream()', function(){
    beforeEach(function(){
      upstream = env.mock('Tada.Git.Entity.RemoteBranch');
      branch = new Tada.Git.Entity.LocalBranch({ name: 'foo', commits: [commit1], upstream: upstream });
    });

    it('should throw when branch does not have upstream', function(){
      branch = new Tada.Git.Entity.LocalBranch({ name: 'foo', commits: [commit1] });
      (function(){ branch.isSyncedWithUpstream(); }).should.throw('Branch does not have upstream');
    });

    it('should return false when branch last commit and upstream last commit is not same', function(){
      upstream.getLatestCommit.returns(commit2);
      branch.isSyncedWithUpstream().should.be.false;
    });

    it('should return true when branch last commit and upstream last commit is same', function(){
      upstream.getLatestCommit.returns(commit1);
      branch.isSyncedWithUpstream().should.be.true;
    });
  });

  describe('getters and setters', function(){
    beforeEach(function(){
      branch = new Tada.Git.Entity.LocalBranch({ name: 'foo', commits: [commit1] });
    });

    it('should has for aheadFromUpstream', function(){
      (branch.getAheadFromUpstream() == undefined).should.be.true;
      branch.setAheadFromUpstream(2);
      branch.getAheadFromUpstream().should.be.eql(2);
    });

    it('should has for behindFromUpstream', function(){
      (branch.getBehindFromUpstream() == undefined).should.be.true;
      branch.setBehindFromUpstream(2);
      branch.getBehindFromUpstream().should.be.eql(2);
    });
  });
});
