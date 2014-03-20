require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Repository');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('../Branch');
require('../LocalBranch');
require('../Repository');
require('../RepositoryFileStatus');
require('../RepositoryRepository');

describeUnitTest('Tada.Git.Entity.RepositoryRepository', function() {
  var
    repo,
    repository;

  beforeEach(function(){
    repo = env.mock('Tada.Git.Entity.Repository');
    repo.name = 'foo';
    repo.getAuthors.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getRemotes.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getCommits.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getRemoteBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getFileStatus.returns(env.mock('Tada.Git.Entity.RepositoryFileStatus'));
    repository = new Tada.Git.Entity.RepositoryRepository({entityCls: 'Tada.Git.Entity.Repository', data: [ repo ]});
  });

  describe('_update(entity, data)', function() {
    it('should update the remotes list', function(){
      repository.updateEntity({ name: 'foo', remotes: { 'origin': 'foo'} });
      repo.getRemotes().update.calledWith([{ name: 'origin', url: 'foo'}]).should.be.true;
    });

    it('should update the author list', function(){
      repository.updateEntity({ name: 'foo', authors: [{ name: 'Foo', email: 'foo@email.com'}] });
      repo.getAuthors().update.calledWith([{ name: 'Foo', email: 'foo@email.com'}]).should.be.true;
    });

    it('should update the commits', function(){
      var author = { name: 'foo' };
      repo.getAuthors().getEntity.returns(author);

      repository.updateEntity({ name: 'foo', commits: [{ hash: 'aad', subject: 'foo', author: 'bar'} ] });
      repo.getCommits().update.calledWith([{ hash: 'aad', subject: 'foo', author: author }]).should.be.true;

      repo.getAuthors().getEntity.alwaysCalledWith('bar').should.be.true;
    });

    it('should update the remote branches', function(){
      var commit = { hash: 'aad' };
      repo.getCommits().getEntity.returns(commit);

      repository.updateEntity({ name: 'foo', remoteBranches: [{ name: 'origin/master', lastCommit: 'aad'} ] });
      repo.getRemoteBranches().update.calledWith([{ name: 'origin/master', commits: [ commit ], lastCommit: 'aad' }]).should.be.true;

      repo.getCommits().getEntity.alwaysCalledWith('aad').should.be.true;
    });

    it('should update the local branches', function(){
      var
        commit = { hash: 'aad' },
        upstream = { name: 'origin/master' };

      repo.getCommits().getEntity.returns(commit);
      repo.getRemoteBranches().getEntity.returns(upstream);

      repository.updateEntity({
        name: 'foo',
        remoteBranches: [{ name: 'origin/master', lastCommit: 'aad'}],
        branches: [{ name: 'master', upstream: 'origin/master', lastCommit: 'aad'} ]
      });

      repo.getLocalBranches().update.calledWith([{ name: 'master', commits: [ commit ], upstream: upstream, lastCommit: 'aad' }]).should.be.true;

      repo.getRemoteBranches().getEntity.alwaysCalledWith('origin/master').should.be.true;
    });

    it('should add current branch from status to local branches if for-each-ref returned with empty local branch array', function() {
      repository.updateEntity({
        name: 'foo',
        branches: [],
        status: {
          branch: {
            name: 'foobranch',
            status: []
          }
        }
      });

      repo.getLocalBranches().update.calledWith([{ name: 'foobranch', commits: [] }]).should.be.true;
    });

    it('should update the currentBranch', function(){
      var branch = env.mock('Tada.Git.Entity.LocalBranch');
      repo.getLocalBranches().getEntity.returns(branch);

      repository.updateEntity({
        name: 'foo',
        status: {
          branch: {
            name: 'master',
            status: [{ type: 'ahead', commits: 2 }]
          }
        }
      });

      repo.setCurrentBranch.alwaysCalledWith(branch).should.be.true;
      branch.setAheadFromUpstream.alwaysCalledWith(2).should.be.true;
    });

    it("should not update the currentBranch when there isn't any", function() {
      repository.updateEntity({
        name: 'foo',
        status: {
          branch: {
            name: '',
            status: []
          }
        }
      });

      repo.setCurrentBranch.called.should.not.be.ok;
    });

    it('should update the filestatus entity', function(){
      repository.updateEntity({
        name: 'foo',
        status: {
          staged: ['foo'],
          not_staged: ['bar'],
          untracked: ['foobar']
        }
      });

      repo.getFileStatus().setStaged.alwaysCalledWith(['foo']).should.be.true;
      repo.getFileStatus().setNotStaged.alwaysCalledWith(['bar']).should.be.true;
      repo.getFileStatus().setUntracked.alwaysCalledWith(['foobar']).should.be.true;
    });
  });
});
