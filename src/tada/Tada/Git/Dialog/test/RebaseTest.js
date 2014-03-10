require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('consoloid-console/Consoloid/Entity/Repository');
require('../AbstractDialog');
require('../Rebase');
require('../../Entity/Branch');
require('../../Entity/Project');
require('../../Entity/Repository');
require('../../Entity/LocalBranch');
require('../../Entity/RepositoryFileStatus');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.Rebase', function() {
  var
    repo,
    branch,
    dialog,
    rebaseResponse,
    refreshResponse,
    queue;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Rebase', { arguments: {} });
    dialog.arguments.branch = { value: 'foo' };
    dialog._renderRepository = sinon.stub();

    branch = env.mock('Tada.Git.Entity.Branch');
    branch.getName.returns('foo');
    repo = env.mock('Tada.Git.Entity.Repository');
    repo.getName.returns('tada');
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getCurrentBranch.returns(env.mock('Tada.Git.Entity.LocalBranch'));
    repo.getRemoteBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getFileStatus.returns(env.mock('Tada.Git.Entity.RepositoryFileStatus'));
    repo.getCurrentBranch().getCommits.returns([3, 2]);

    var project = env.mock('Tada.Git.Entity.Project');
    project.getRepository.returns(repo);
    env.addServiceMock('git.project', project);

    rebaseResponse = {};
    refreshResponse = {};
    queue = {
      rebase: function(cb) { cb(rebaseResponse); return queue },
      refresh: sinon.stub().yields(refreshResponse),
      killQueue: sinon.stub()
    }
    sinon.spy(queue, "rebase");
    env.addServiceMock('git.repository.command.queues', {
      getQueue: sinon.stub().returns(queue)
    });
  });

  describe("#_processRepository()", function() {
    it('should display error when repo is dirty', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      repo.getFileStatus().isDirty.returns(true);
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada');
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      dialog._renderRepository.args[0][1].links.should.be.ok;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when repo is on the requested branch', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      repo.getCurrentBranch().getName.returns('foo');

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { message: { type: Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR, text: 'Cannot rebase a branch to itself' } }).should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when requested branch does not exists in the repo', function(){
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada',  { message: { type: Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR, text: 'Branch foo does not exist' } }).should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when rebase was unsuccessful', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      rebaseResponse.err = 'BU';
      dialog._processRepository('tada');

      dialog._renderRepository.args[0][0].should.equal("tada");
      dialog._renderRepository.args[0][1].message.text.indexOf("BU").should.not.equal(-1);
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      repo.getRemoteBranches().getEntity.alwaysCalledWith('foo').should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should also find a local branch', function(){
      repo.hasLocalBranch.returns(true);
      repo.getLocalBranches().getEntity.returns(branch);

      dialog._processRepository('tada');

      dialog._renderRepository.args[0][1].branch.should.be.ok;
      (dialog._renderRepository.args[0][1].titleLinks || []).length.should.equal(0);
      repo.getLocalBranches().getEntity.alwaysCalledWith('foo').should.be.true;
    });

    it('should kill queue if rebase returned with error', function() {
      rebaseResponse.err = 'BU';
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);
      dialog._processRepository('tada');

      queue.rebase.calledOnce.should.be.ok;
      queue.refresh.calledOnce.should.be.ok;
      queue.killQueue.calledOnce.should.be.ok;
    });

    it('should allow push if rebase error is that branch is up to date', function() {
      rebaseResponse = "Current branch foobar is up to date.";
      var upstream = env.mock('Tada.Git.Entity.Branch');
      upstream.getLatestCommit.returns({
        getHash: sinon.stub().returns("foo")
      })
      repo.getCurrentBranch().getUpstream.returns(upstream);
      repo.getCurrentBranch().getLatestCommit.returns({
        getHash: sinon.stub().returns("bar")
      })

      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);
      dialog._processRepository('tada');

      queue.killQueue.calledOnce.should.be.ok;
      dialog._renderRepository.args[0][1].titleLinks.should.be.ok;
    });

    it('should call refresh when rebase was successful', function() {
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      dialog._processRepository('tada');

      queue.rebase.calledOnce.should.be.ok;
      queue.refresh.calledOnce.should.be.ok;
      queue.refresh.args[0][1].should.equal('tada');
      //queue.refresh.args[0][2].should.equal(['localRefList']);
    });

    it('should mention branches when rebase was successful', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);
      branch.getCommits.returns([1,0]);

      dialog._processRepository('tada');

      branch.mention.called.should.be.true;
      repo.getCurrentBranch().mention.called.should.be.true;
    });

    describe('fixed $@UPSTREAM branch argument value', function(){
      it('should display error when current branch does not has upstream', function(){
        dialog.toUpstream = true;
        repo.getCurrentBranch().getName.returns('foo');

        dialog._processRepository('tada');

        dialog._renderRepository.alwaysCalledWith('tada', { message: { type: Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR, text: 'Branch foo does not have an upstream' } }).should.be.true;
        branch.setCommits.called.should.be.false;
      });

      it('should rebase to the upstream branch', function(){
        dialog.toUpstream = true;
        repo.getCurrentBranch().getUpstream.returns(branch);
        dialog._processRepository('tada');

        dialog._renderRepository.args[0][1].branch.should.be.ok;
      });
    });
  });
});
