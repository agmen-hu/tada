require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../../AbstractDialog');
require('../Create');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.Branch.Create', function() {
  var
    dialog,
    repo,
    create,
    project,
    queues;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Branch.Create', { arguments: { branch: { value: "fooBranch" } } });
    dialog._renderRepository = sinon.stub();

    create = sinon.stub();
    repo = {
      getLocalBranches: sinon.stub().returns({
        hasEntity: sinon.stub().returns(false),
        getEntity: sinon.stub().returns({ foo: "bar" }),
        createEntity: sinon.stub().returns({
          foo: "bar",
          mention: sinon.stub()
        })
      }),
      getRemoteBranches: sinon.stub().returns({
        data: [],
        forEach: function(callback) {
          this.data.forEach(callback, this);
        }
      }),
      getCurrentBranch: sinon.stub().returns({
        getLatestCommit: sinon.stub().returns({ fooCommit: "bar" })
      })
    }
    queues = {
      getQueue: sinon.stub().returns({
        createBranch: create
      }),
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
  });

  describe("#_processRepository()", function() {
    it('should create branch in repository', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      create.calledOnce.should.be.ok;
      create.args[0][1].should.equal("tada")
      create.args[0][2].should.equal("fooBranch")
      create.args[0][0]();

      project.getRepository.calledWith("tada").should.be.ok;
      repo.getLocalBranches().createEntity.calledOnce.should.be.ok;
      repo.getLocalBranches().createEntity.args[0][0].name.should.equal("fooBranch");
      repo.getLocalBranches().createEntity.args[0][0].commits[0].fooCommit.should.equal("bar");
      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].branch.foo.should.equal("bar");
    });

    it('should mention the newly created branch', function() {
      dialog._processRepository("tada");
      create.args[0][0]();

      repo.getLocalBranches().createEntity().mention.calledOnce.should.be.ok;
    });

    it('should not create one if it already exists', function() {
      repo.getLocalBranches().hasEntity.returns(true)

      dialog._processRepository("tada");

      create.calledOnce.should.not.be.ok;
      dialog._renderRepository.args[0][1].branch.foo.should.equal("bar");
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it('should render error if servere called back with one', function() {
      dialog._processRepository("tada");
      create.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });
  });
});
