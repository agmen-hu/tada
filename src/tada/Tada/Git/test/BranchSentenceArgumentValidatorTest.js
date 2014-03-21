require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable')
require("consoloid-console/Consoloid/Interpreter/InvalidArgumentsError");
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
    global.__ = function(text) { return text; }
    validator = env.create('Tada.Git.BranchSentenceArgumentValidator', {});

    var project = env.mock('Tada.Git.Entity.Project');
    env.addServiceMock('git.project', project);
    project.getRepository.returns(env.mock('Tada.Git.Entity.Repository'));
  });

  describe('#validateRepoAndBranch(arguments)', function(){
    basicTests('validateRepoAndBranch');

    it('should return the repository branchExistsLocallyOrAtSomeRemote method return value', function(){
      env.container.get('git.project').getRepository().branchExistsLocallyOrAtSomeRemote.returns(false);

      (function() {
        validator.validateRepoAndBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}});
      }).should.throwError();
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

      (function(){
        validator.validateRepoAndLocalBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}});
      }).should.throwError();
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

      (function() {
        validator.validateRepoAndRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}})
      }).should.throwError();
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

      (function() {
        validator.validateRepoAndLocalOrRemoteBranch({repo: { entity: {}, value: 'foo'}, branch: {entity: {}, value: 'master'}})
      }).should.throwError();
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
      env.container.get('git.project').getRepository().hasCurrentBranch.returns(true);
      env.container.get('git.project').getRepository().getCurrentBranch.returns(branch);
      (function() {
        validator.validateRepoCurrentBranchHasUpstream({repo: {entity: 'foo'}})
      }).should.throwError();

      branch.getUpstream.returns('foo');
      validator.validateRepoCurrentBranchHasUpstream({repo: {entity: 'foo'}}).should.be.true;
    });

    it('should throw error referencing detached head if repository has no current branch', function() {
      var branch = env.mock('Tada.Git.Entity.LocalBranch');
      env.container.get('git.project').getRepository().hasCurrentBranch.returns(false);
      env.container.get('git.project').getRepository().getCurrentBranch.throws();

      (function() {
        validator.validateRepoCurrentBranchHasUpstream({repo: {entity: 'foo'}})
      }).should.throwError(/detached/);
    })
  });

  afterEach(function() {
    delete global.__;
  })
});
