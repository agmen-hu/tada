require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Repository');
require('consoloid-console/Consoloid/Entity/Mentionable');
require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('../../AbstractDialog');
require('../../../Entity/Project');
require('../../../Entity/Repository');
require('../../../Entity/Branch');
require('../../../Entity/LocalBranch');
require('../../../ContextForgetter');

require('../Delete');

describeUnitTest('Tada.Git.Dialog.Branch.Delete', function() {
  var
    repo,
    branch,
    dialog,
    deleteResponse;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Branch.Delete', { arguments: {} });
    dialog.arguments.branch = { value: 'foo' };
    dialog._renderRepository = sinon.stub();

    branch = env.mock('Tada.Git.Entity.LocalBranch');
    repo = env.mock('Tada.Git.Entity.Repository');
    repo.getName.returns('tada');
    repo.hasLocalBranch.returns(true);
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getCurrentBranch.returns(branch);
    repo.getLocalBranches().getEntity.returns(branch);

    var project = env.mock('Tada.Git.Entity.Project');
    project.getRepository.returns(repo);
    env.addServiceMock('git.project', project);

    deleteResponse = {};
    env.addServiceMock('repository.command.queues', {getQueue: sinon.stub().returns({
      deleteLocalBranch: function(cb) { cb(deleteResponse); }
    })});

    env.addServiceMock('git.context.forgetter', env.mock('Tada.Git.ContextForgetter'));
  });

  describe("#_processRepository(repoName)", function() {
    it('should display en error when repo is on the requested branch', function(){
      repo.getCurrentBranch().getName.returns('foo');

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Cannot delete foo branch, because you are on it!' }).should.be.true;
      repo.setCurrentBranch.called.should.be.false;
    });

    it('should display an error when the requested branch does not exist', function(){
      repo.hasLocalBranch.returns(false);

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Branch foo does not exist!' }).should.be.true;
      repo.setCurrentBranch.called.should.be.false;
    });

    it('should display the error when server returns with an error', function(){
      deleteResponse.message = 'Error';
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: deleteResponse, branchName: 'foo', repo: repo, upstreamName: ''}).should.be.true;
    });

    it('should remove the branch entity from the repository', function(){
      branch.getUpstream.returns({getName: sinon.stub().returns('origin/foo')});
      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: undefined, branchName: 'foo', repo: repo, upstreamName: 'origin/foo'}).should.be.true;
      repo.getLocalBranches().removeEntity.alwaysCalledWith('foo').should.be.true;
    });

    it('should forget the removed branch from the context', function(){
      dialog._processRepository('tada');

      env.container.get('git.context.forgetter').localBranch.alwaysCalledWith('foo').should.be.true;
    });
  });
});
