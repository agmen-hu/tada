require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('consoloid-console/Consoloid/Entity/Repository');
require('../../../Entity/Repository');
require('../../../Entity/Branch');
require('../../../Entity/RemoteBranch');
require('../../../Entity/LocalBranch');
require('../../AbstractDialog');
require('../DeleteRemote');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.Branch.DeleteRemote', function() {
  var
    dialog,
    branch,
    localBranch,
    repo,
    remove,
    deleteLocal,
    project,
    queues,
    contextForgetter;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Branch.DeleteRemote', {
      arguments: {
        branch: { value: "origin/foobranch" },
        deleteLocal: { value: true }
      }
    });
    dialog._renderRepository = sinon.stub();

    branch = env.mock('Tada.Git.Entity.RemoteBranch');
    branch.getName.returns('origin/foobranch');
    branch.getLocalName.returns('foobranch');
    branch.getRemoteName.returns('origin');

    localBranch = env.mock('Tada.Git.Entity.LocalBranch');

    repo = env.mock('Tada.Git.Entity.Repository');
    repo.getName.returns('tada');
    repo.getCurrentBranch.returns(env.mock('Tada.Git.Entity.LocalBranch'));
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getRemoteBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getRemoteBranches().getEntity.returns(branch);
    repo.getLocalBranches().getEntity.returns(localBranch);
    repo.hasRemoteBranch.returns(true);
    repo.hasLocalBranch.returns(true);

    remove = sinon.stub();
    deleteLocal = sinon.stub();
    queues = {
      getQueue: sinon.stub().returns({
        deleteRemoteBranch: remove,
        deleteLocalBranch: deleteLocal
      })
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);

    contextForgetter = {
      remoteBranch: sinon.stub(),
      localBranch: sinon.stub(),
    }
    env.addServiceMock('git.context.forgetter', contextForgetter);
  });

  describe("#_processRepository()", function() {
    it('should delete remote branch from the repository, then refresh the model', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      remove.calledOnce.should.be.ok;
      remove.args[0][1].should.equal("tada");
      remove.args[0][2].should.equal("origin");
      remove.args[0][3].should.equal("foobranch");
      remove.args[0][0]();

      deleteLocal.calledOnce.should.be.ok;
      deleteLocal.args[0][1].should.equal("tada");
      deleteLocal.args[0][2].should.equal("foobranch");
      deleteLocal.args[0][0]();

      project.getRepository.calledWith("tada").should.be.ok;

      repo.getLocalBranches().removeEntity.calledOnce.should.be.ok;
      repo.getLocalBranches().removeEntity.calledWith("foobranch").should.be.ok;
      repo.getRemoteBranches().removeEntity.calledOnce.should.be.ok;
      repo.getRemoteBranches().removeEntity.calledWith("origin/foobranch").should.be.ok;

      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].message.should.be.ok;
    });

    it("should forget removed local and remote branch", function() {
      dialog._processRepository("tada");
      remove.args[0][0]();
      deleteLocal.args[0][0]();

      contextForgetter.localBranch.calledWith("foobranch").should.be.ok;
      contextForgetter.remoteBranch.calledWith("origin/foobranch").should.be.ok;
    });

    it("should not attempt to delete local branch if it does not exist", function() {
      repo.hasLocalBranch.returns(false);
      dialog._processRepository("tada");
      remove.args[0][0]();
      deleteLocal.calledOnce.should.not.be.ok;
      repo.getLocalBranches().removeEntity.calledWith("foobranch").should.not.be.ok;
      contextForgetter.localBranch.calledWith("foobranch").should.not.be.ok;
      dialog._renderRepository.calledWith("tada").should.be.ok;
      (dialog._renderRepository.args[0][1].links || []).length.should.not.be.ok;
    });

    it("should not attempt to delete local branch if the argument was not set", function() {
      dialog.arguments.deleteLocal = false;
      dialog._processRepository("tada");
      remove.args[0][0]();
      deleteLocal.calledOnce.should.not.be.ok;
      repo.getLocalBranches().removeEntity.calledWith("foobranch").should.not.be.ok;
      contextForgetter.localBranch.calledWith("foobranch").should.not.be.ok;
      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].links.should.be.ok;
    });

    it("should not allow delete if remote branch does not exist", function() {
      repo.hasRemoteBranch.returns(false);

      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.not.be.ok;
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it('should render error if server called back with one', function() {
      dialog._processRepository("tada");
      remove.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it('should not try to delete the local branch when that is the current branch', function(){
      repo.getCurrentBranch.returns(localBranch);

      dialog._processRepository("tada");
      remove.args[0][0]('Cannot delete local foobranch branch because you are currently on it');

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    })
  });
});
