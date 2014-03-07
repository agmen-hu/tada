require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../StashChanges');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.StashChanges', function() {
  var
    dialog,
    repo,
    stash,
    project,
    queues;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.StashChanges', { arguments: {} });
    dialog._renderRepository = sinon.stub();

    stash = sinon.stub();
    repo = {
      getFileStatus: sinon.stub().returns({
        isDirty: sinon.stub().returns(true),
        setStaged: sinon.stub(),
        setNotStaged: sinon.stub(),
      }),
      getCurrentBranch: sinon.stub().returns("foo")
    }
    queues = {
      getQueue: sinon.stub().returns({
        stash: stash
      }),
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
  });

  describe("#_processRepository()", function() {
    it('should stash changes, and modify the model accordingally', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      stash.calledOnce.should.be.ok;
      stash.args[0][1].should.equal("tada");
      (stash.args[0][2] == undefined).should.be.ok;
      stash.args[0][0]();

      project.getRepository.calledWith("tada").should.be.ok;

      repo.getFileStatus().setStaged.calledOnce.should.be.ok;
      repo.getFileStatus().setStaged.calledWith([]).should.be.ok;
      repo.getFileStatus().setNotStaged.calledOnce.should.be.ok;
      repo.getFileStatus().setNotStaged.calledWith([]).should.be.ok;

      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].message.should.be.ok;
      dialog._renderRepository.args[0][1].branch.should.equal("foo");
    });

    it('should not allow stash if there were no local changes', function() {
      repo.getFileStatus().isDirty.returns(false);
      dialog._processRepository("tada");

      dialog._renderRepository.args[0][1].message.text.should.equal("There were no local changes to stash");
      (dialog._renderRepository.args[0][1].links || []).length.should.equal(0);
    });

    it('should render error if server called back with one', function() {
      dialog._processRepository("tada");
      stash.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });
  });
});
