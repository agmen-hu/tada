require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable')
require('../Entity/Project');
require('../Entity/Repository');
require('../Entity/Branch');
require('../Entity/LocalBranch');
require('../BranchSentenceArgumentValidator');

describeUnitTest('Tada.Git.BranchSentenceArgumentValidator', function() {
  var
    validator,
    basicTests = function(methodName) {
      it('should return true if no repository passed', function(){
        validator[methodName]({}).should.be.true;
        validator[methodName]({repo: undefined}).should.be.true;
        validator[methodName]({repo: {entity: undefined}}).should.be.true;
      });

      it('should return true if no branch passed', function(){
        validator[methodName]({}).should.be.true;
        validator[methodName]({branch: undefined}).should.be.true;
        validator[methodName]({branch: {entity: undefined}}).should.be.true;
      });
    };

  beforeEach(function() {
    validator = env.create('Tada.Git.BranchSentenceArgumentValidator', {});

    var project = env.mock('Tada.Git.Entity.Project');
    env.addServiceMock('git.project', project);
    project.getRepository.returns(env.mock('Tada.Git.Entity.Repository'));
  });

  describe('#validateRepoAndBranch(arguments)', function(){
    basicTests('validateRepoAndBranch');

    it('should return the repository branchExistsLocallyOrAtSomeRemote method return value', function(){
      env.container.get('git.project').getRepository().branchExistsLocallyOrAtSomeRemote.returns(false);

      validator.validateRepoAndBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.false;
      env.container.get('git.project').getRepository.calledWith('foo').should.be.true;
      env.container.get('git.project').getRepository().branchExistsLocallyOrAtSomeRemote.alwaysCalledWith('master');

      env.container.get('git.project').getRepository().branchExistsLocallyOrAtSomeRemote.returns(true);
      validator.validateRepoAndBranch({repo: { value: 'foo'}, branch: {value: 'master'}}).should.be.true;
    });
  });

  describe('#validateRepoAndLocalBranch(arguments)', function(){
    basicTests('validateRepoAndLocalBranch');

    it('should return true when repo has local branch with the given name', function(){
      env.container.get('git.project').getRepository().hasLocalBranch.returns(true);

      validator.validateRepoAndLocalBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.true;
      env.container.get('git.project').getRepository.calledWith('foo').should.be.true;
      env.container.get('git.project').getRepository().hasLocalBranch.alwaysCalledWith('master');
    });

    it('should return false when repo does not have local branch', function(){
      env.container.get('git.project').getRepository().hasLocalBranch.returns(false);

      validator.validateRepoAndLocalBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.false;
    });
  });

  describe('#validateRepoAndRemoteBranch(arguments)', function(){
    basicTests('validateRepoAndRemoteBranch');

    it('should return true when repo has remote branch with the given name', function(){
      env.container.get('git.project').getRepository().hasRemoteBranch.returns(true);

      validator.validateRepoAndRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'origin/master'}}).should.be.true;
      env.container.get('git.project').getRepository.calledWith('foo').should.be.true;
      env.container.get('git.project').getRepository().hasRemoteBranch.alwaysCalledWith('origin/master');
    });

    it('should return false when repo does not have remote branch', function(){
      env.container.get('git.project').getRepository().hasRemoteBranch.returns(false);

      validator.validateRepoAndRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.false;
    });
  });

  describe('#validateRepoAndLocalOrRemoteBranch(arguments)', function(){
    basicTests('validateRepoAndLocalOrRemoteBranch');

    it('should return true when repo has remote branch with the given name', function(){
      env.container.get('git.project').getRepository().hasRemoteBranch.returns(true);

      validator.validateRepoAndLocalOrRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'origin/master'}}).should.be.true;
      env.container.get('git.project').getRepository.calledWith('foo').should.be.true;
      env.container.get('git.project').getRepository().hasRemoteBranch.alwaysCalledWith('origin/master');
    });

    it('should return true when repo has local branch with the given name', function(){
      env.container.get('git.project').getRepository().hasLocalBranch.returns(true);

      validator.validateRepoAndLocalOrRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.true;
      env.container.get('git.project').getRepository.calledWith('foo').should.be.true;
      env.container.get('git.project').getRepository().hasLocalBranch.alwaysCalledWith('master');
    });

    it('should return false when repo does not have either remote nor local branch', function(){
      env.container.get('git.project').getRepository().hasLocalBranch.returns(false);

      validator.validateRepoAndLocalOrRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}}).should.be.false;
    });
  });

  describe('#validateRepoCurrentBranchHasUpstream(arguments)', function(){
    it('should return true if no repository passed', function(){
      validator.validateRepoCurrentBranchHasUpstream({}).should.be.true;
      validator.validateRepoCurrentBranchHasUpstream({repo: undefined}).should.be.true;
      validator.validateRepoCurrentBranchHasUpstream({repo: {entity: undefined}}).should.be.true;
    });

    it('should return wheter current branch has or has not upstream', function(){
      var branch = env.mock('Tada.Git.Entity.LocalBranch');
      env.container.get('git.project').getRepository().getCurrentBranch.returns(branch);

      validator.validateRepoCurrentBranchHasUpstream({repo: {entity: 'foo'}}).should.be.false;

      branch.getUpstream.returns('foo');
      validator.validateRepoCurrentBranchHasUpstream({repo: {entity: 'foo'}}).should.be.true;
    });
  });
});
