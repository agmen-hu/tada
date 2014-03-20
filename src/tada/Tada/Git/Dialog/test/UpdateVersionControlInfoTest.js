require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../DataFromModel');
require('../ShowVersionControlSummary');
require('../UpdateVersionControlInfo');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.UpdateVersionControlInfo', function() {
  var
    dialog,
    refresh,
    project,
    queues,
    repo;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.UpdateVersionControlInfo', {});
    dialog._renderRepository = sinon.stub();

    var repo = {
      getFileStatus: sinon.stub().returns({
        isDirty: sinon.stub()
      }),
      hasCurrentBranch: sinon.stub().returns(true),
      getCurrentBranch: sinon.stub().returns({
        getCommits: sinon.stub().returns("foocomit")
      })
    }

    refresh = sinon.stub();
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
    queues = {
      getQueue: sinon.stub().returns({
        refresh: refresh
      }),
    }
    env.addServiceMock('git.repository.command.queues', queues);
  });

  describe("#_processRepository()", function() {
    it('should request repository infos from the command queues, and render them', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;

      refresh.calledOnce.should.be.ok;

      refresh.args[0][0]();

      project.getRepository.calledWith("tada").should.be.ok;

      dialog._renderRepository.calledWith("tada").should.be.ok;
    });
  });
});
