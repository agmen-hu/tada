require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('../Branch');
require('../Commit');
require('../../Error/UserMessage');

describeUnitTest('Tada.Git.Entity.Branch', function() {
  var
    branch,
    commit1,
    commit2;

  beforeEach(function(){
    commit1 = env.mock('Tada.Git.Entity.Commit');
    commit2 = env.mock('Tada.Git.Entity.Commit');
    branch = new Tada.Git.Entity.Branch({ name: 'foo', commits: [commit1, commit2] });
  });

  describe('constructor', function(){
    it('should throw when name is not present', function(){
      (function(){ new Tada.Git.Entity.Branch({ commits: [commit1 ] })}).should.throw('name must be injected');
    });
  });

  describe('getters', function(){
    it('should has for name', function(){
      branch.getName().should.be.eql('foo');
    });

    it('should has for latest commit', function(){
      branch.getLatestCommit().should.be.eql(commit1);
    });

    it('should throw Tada.Git.Error.UserMessage if there is no latest commit', function() {
      branch = new Tada.Git.Entity.Branch({ name: 'foo', commits: [] });
      (function() {
        branch.getLatestCommit();
      }).should.throwError(Tada.Git.Error.UserMessage);
    });

    it('should have one for commits', function() {
      branch.getCommits().should.equal(branch.commits);
    })
  });

  describe('#setCommits(commits)', function(){
    it('should throw when array elements are not commits or there was no array added', function(){
      (function(){ branch.setCommits(); }).should.throw();
      (function(){ branch.setCommits(['foo']); }).should.throw();
    });

    it('should set the commits', function(){
      branch.setCommits([commit2]);
      branch.getLatestCommit().should.be.eql(commit2);
    });
  });
});
