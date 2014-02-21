require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Repository');
require('../Project');

describeUnitTest('Tada.Git.Entity.Project', function() {
  var
    tada,
    project,
    context,
    remoteService;

  beforeEach(function() {
    Tada.Git.Entity.Project.prototype.create = sinon.stub();

    tada = {
      getConfig: sinon.stub().returns({
                  'tada':{},
                  'foo':{}
                })
    };
    env.addServiceMock('tada', tada);

    remoteService = {
      callAsync: function() {
        arguments[2].success({ foo: "bar" });
      }
    }
    sinon.spy(remoteService, "callAsync");
    env.addServiceMock('git.command.initial_info', remoteService);

    context = {
      add: sinon.spy()
    };
    env.addServiceMock('context', context);

  });

  describe('#__construct(options)', function(){
    it('should create the repository repository with empty repositories', function() {
      var repositoryRepository = {
        createOrUpdateEntity: sinon.stub()
      }
      Tada.Git.Entity.Project.prototype.create.withArgs('Tada.Git.Entity.RepositoryRepository').returns(repositoryRepository);
      project = env.create('Tada.Git.Entity.Project', {});

      Tada.Git.Entity.Project.prototype.create.args[0][0].should.equal('Tada.Git.Entity.RepositoryRepository');

      repositoryRepository.createOrUpdateEntity.calledTwice.should.be.ok;
    });
  });

  describe("managing repository entities", function() {
    var
      update;
    beforeEach(function() {
      project = env.create('Tada.Git.Entity.Project', {
        repositoryRepository: env.mock('Consoloid.Entity.Repository'),
      });
      update = sinon.stub();
      project.repositoryRepository.updateEntity = sinon.stub();
    });

    describe('#getRepository(repoName)', function(){
      it('should return the repsoitory context object', function() {
        project.repositoryRepository.getEntity.returns({ foo: "bar" });
        project.getRepository('tada').foo.should.equal("bar");
      });
    });

    describe('#getRepositories()', function() {
      it('should the repositories', function() {

        project.getRepositories().should.be.ok;
      });
    });

    describe('#update(repoName, repoData)', function() {
      it('should update the repository', function() {
        project.update('tada', { foo: "bar" });

        project.repositoryRepository.updateEntity.calledOnce.should.be.ok;
        project.repositoryRepository.updateEntity.args[0][0].name.should.equal("tada");
        project.repositoryRepository.updateEntity.args[0][0].foo.should.equal("bar");
      });
    });

    describe("#callMethodOnReposUntilTrue(method, args)", function() {
      it('should call a method on the repos until one of it returns with true', function() {
        project.getRepositories = sinon.stub().returns([{
          foo: sinon.stub().returns(false)
        },{
          foo: sinon.stub().returns(true)
        },{
          foo: sinon.stub().returns(true)
        }])
        project.callMethodOnReposUntilTrue("foo").should.be.ok;
        project.getRepositories()[0].foo.calledOnce.should.be.ok;
        project.getRepositories()[1].foo.calledOnce.should.be.ok;
        project.getRepositories()[2].foo.calledOnce.should.not.be.ok;
      });
    });
  });
});
