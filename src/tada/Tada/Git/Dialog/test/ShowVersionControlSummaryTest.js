require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/Widget');
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-framework/Consoloid/Test/UnitTest');
require('../AbstractDialog');
require('../DataFromModel');
require('../ShowVersionControlSummary');

describeUnitTest('Tada.Git.Dialog.ShowVersionControlSummary', function() {
  var
    dialog,
    project,
    repo;

  beforeEach(function() {
    repo = {
      getCurrentBranch: sinon.stub().returns({
        getName: sinon.stub().returns("master"),
        mention: sinon.stub(),
        getAheadFromUpstream: sinon.stub().returns(false),
        getCommits: sinon.stub().returns(["foocomit"])
      }),
      getFileStatus: sinon.stub().returns({
        isDirty: sinon.stub().returns(false)
      }),
      hasCurrentBranch: sinon.stub().returns(true),
      mention: sinon.stub()
    }
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
    dialog = env.create('Tada.Git.Dialog.ShowVersionControlSummary', { });
  });

  describe('#__requestDataFromRepositories()', function() {
    beforeEach(function() {
      dialog.response = {
        find: sinon.stub().returns({
          empty: sinon.stub().returns({
            jqoteapp: sinon.stub()
          }),
          removeClass: sinon.stub()
        })
      }
      dialog.repositoryTemplate = {
        get: sinon.stub()
      }
      env.addServiceMock('console', {
        animateMarginTopIfNecessary: sinon.stub(),
        getLastDialog: sinon.stub()
      });
      dialog._processRepository("tada");
    });

    it("should append the repo from the project", function() {
      project.getRepository.calledWith("tada").should.be.ok;
      dialog.response.find().empty().jqoteapp.args[0][1].repo.should.equal(repo);
    });

    it("should mention repos and current branches", function() {
      repo.mention.calledOnce.should.be.ok;
      repo.getCurrentBranch().mention.calledOnce.should.be.ok;
    });

    it("should show global push link if there is a repo that is ahead", function() {
      dialog.response.find().removeClass.called.should.not.be.ok;
      repo.getCurrentBranch().getAheadFromUpstream.returns(true);
      dialog._processRepository("tada");
      dialog.response.find().removeClass.calledOnce.should.be.ok;
    });

    it("should show global stash link if there is a repo that is ahead", function() {
      dialog.response.find().removeClass.called.should.not.be.ok;
      repo.getFileStatus().isDirty.returns(true);
      dialog._processRepository("tada");
      dialog.response.find().removeClass.calledOnce.should.be.ok;
    });

    it("should work if current branch does not have anny commit", function() {
      repo.getCurrentBranch().getCommits.returns([]);
      dialog._processRepository("tada");

      (dialog.response.find().empty().jqoteapp.args[1][1].branch == undefined).should.be.ok;
      dialog.response.find().empty().jqoteapp.args[1][1].message.should.be.ok;
      (dialog.response.find().empty().jqoteapp.args[1][1].message.type == Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR).should.not.be.ok;
    });

    it("should work if repo has a detached head", function() {
      repo.hasCurrentBranch.returns(false);
      repo.getCurrentBranch.throws();
      dialog._processRepository("tada");

      (dialog.response.find().empty().jqoteapp.args[1][1].branch == undefined).should.be.ok;
      dialog.response.find().empty().jqoteapp.args[1][1].message.should.be.ok;
      (dialog.response.find().empty().jqoteapp.args[1][1].message.type == Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR).should.be.ok;
    });
  });

});
