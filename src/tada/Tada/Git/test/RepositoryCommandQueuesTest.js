require('consoloid-framework/Consoloid/Test/UnitTest');
require('../RepositoryCommandQueues');

describeUnitTest('Tada.Git.RepositoryCommandQueues', function() {
  var
    tada,
    queues,
    context,
    remoteService;

  beforeEach(function() {
    Tada.Git.RepositoryCommandQueues.prototype.create = sinon.stub();

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
    it('should add command queues', function() {
      var repositoryRepository = {
        createOrUpdateEntity: sinon.stub()
      }
      queues = env.create('Tada.Git.RepositoryCommandQueues', {});

      Tada.Git.RepositoryCommandQueues.prototype.create.args[0][0].should.equal('Tada.Git.CommandQueue');
      Tada.Git.RepositoryCommandQueues.prototype.create.args[1][0].should.equal('Tada.Git.CommandQueue');
    });
  });

  describe("#getQueue(reponame)", function() {
    it("should return with a command queue", function() {
      var queue = { foo: "bar" };
      Tada.Git.RepositoryCommandQueues.prototype.create.withArgs('Tada.Git.CommandQueue').returns(queue);
      queues = env.create('Tada.Git.RepositoryCommandQueues', {});

      queues.getQueue("tada").should.equal(queue);
    });
  });

});
