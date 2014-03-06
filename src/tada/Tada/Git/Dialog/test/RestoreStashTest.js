require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../RestoreStash');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.RestoreStash', function() {
  var
    dialog,
    repo,
    stash,
    refresh,
    project,
    contextForgetter;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.RestoreStash', { arguments: {} });
    dialog._renderRepository = sinon.stub();

    refresh = sinon.spy();
    stash = sinon.stub().returns({ refresh: refresh });

    queues = {
      getQueue: sinon.stub().returns({
        createChildQueue: sinon.stub().returns({
          stash: stash,
          killQueue: sinon.spy()
        })
      })
    }
    repo = {
      getFileStatus: sinon.stub().returns({
        isDirty: sinon.stub().returns(true)
      })
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
  });

  describe("#_processRepository()", function() {
    it('should apply stash, and render the changes', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      stash.calledOnce.should.be.ok;
      stash.args[0][1].should.equal("tada");
      stash.args[0][2].should.equal("apply");
      stash.args[0][0]();

      refresh.calledOnce.should.be.ok;
      refresh.args[0][1].should.equal("tada");
      refresh.args[0][2][0].should.equal("status");
      refresh.args[0][0]();

      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].links.length.should.equal(1);
    });

    it("should send drop argument", function() {
      dialog.arguments['drop'] = {
        value: true
      }
      dialog._processRepository("tada");
      stash.args[0][2].should.equal("pop");
    });

    it('should render error if servere called back with one', function() {
      dialog._processRepository("tada");
      stash.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);

      stash.args[0][0]();
      refresh.args[0][0]("OMG another one");
      dialog._renderRepository.args[1][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });
  });
});
