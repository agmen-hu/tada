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
    rebaseResponse;

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
    env.addServiceMock('git.repository.command.queues', {getQueue: sinon.stub().returns({
      rebase: function(cb) { cb(rebaseResponse); }
    })});
  });

  describe("#_processRepository()", function() {
    it('should display error when repo is dirty', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      repo.getFileStatus().isDirty.returns(true);
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Repo has local changes, please commit or stash them' }).should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when repo is on the requested branch', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      repo.getCurrentBranch().getName.returns('foo');

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Cannot rebase a branch to itself' }).should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when requested branch does not exists in the repo', function(){
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Branch foo does not exist' }).should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should display error when rebase was unsuccessful', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);

      rebaseResponse.err = 'BU';
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: rebaseResponse, repo:repo, isShowPush: false }).should.be.true;
      repo.getRemoteBranches().getEntity.alwaysCalledWith('foo').should.be.true;
      branch.setCommits.called.should.be.false;
    });

    it('should also find a local branch', function(){
      repo.hasLocalBranch.returns(true);
      repo.getLocalBranches().getEntity.returns(branch);

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: undefined, repo:repo, isShowPush: false }).should.be.true;
      repo.getLocalBranches().getEntity.alwaysCalledWith('foo').should.be.true;
      branch.setCommits.called.should.be.true;
    });

    it('should update the model when rebase was successful', function(){
      repo.hasRemoteBranch.returns(true);
      repo.getRemoteBranches().getEntity.returns(branch);
      branch.getCommits.returns([1,0]);

      dialog._processRepository('tada');

      branch.setCommits.called.should.be.true;
      branch.setCommits.alwaysCalledWith([3,2,1,0]).should.be.true;

      branch.mention.called.should.be.true;
      repo.getCurrentBranch().mention.called.should.be.true;
    });

    describe('fixed $@UPSTREAM branch argument value', function(){
      it('should display error when current branch does not has upstream', function(){
        dialog.toUpstream = true;
        repo.getCurrentBranch().getName.returns('foo');

        dialog._processRepository('tada');

        dialog._renderRepository.alwaysCalledWith('tada', { error: 'Branch foo does not has upstream' }).should.be.true;
        branch.setCommits.called.should.be.false;
      });

      it('should rebase to the upstream branch', function(){
        dialog.toUpstream = true;
        repo.getCurrentBranch().getUpstream.returns(branch);
        dialog._processRepository('tada');

        dialog._renderRepository.alwaysCalledWith('tada', { error: undefined, repo:repo, isShowPush: false }).should.be.true;
        branch.setCommits.called.should.be.true;
      });
    });
  });
});
