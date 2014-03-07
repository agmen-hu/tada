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
require('../../../Entity/RemoteBranch');
require('../../../Entity/RepositoryFileStatus');

require('../Switch');
require('../CreateAndSwitch');

describeUnitTest('Tada.Git.Dialog.Branch.CreateAndSwitch', function() {
  var
    repo,
    branch,
    dialog,
    checkoutResponse;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Branch.CreateAndSwitch', { arguments: {}, repositoryTemplateId:'foo' });
    dialog.arguments.branch = { value: 'foo' };
    dialog._renderRepository = sinon.spy();

    branch = env.mock('Tada.Git.Entity.RemoteBranch');
    repo = env.mock('Tada.Git.Entity.Repository');
    repo.getName.returns('tada');
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getCurrentBranch.returns(env.mock('Tada.Git.Entity.Branch'));
    repo.getFileStatus.returns(env.mock('Tada.Git.Entity.RepositoryFileStatus'));

    var project = env.mock('Tada.Git.Entity.Project');
    project.getRepository.returns(repo);
    env.addServiceMock('git.project', project);

    checkoutResponse = {};
    env.addServiceMock('git.repository.command.queues', {getQueue: sinon.stub().returns({
      checkout: function(cb) { cb(checkoutResponse); }
    })});

    repo.branchExistsLocallyOrAtSomeRemote.returns(true);
  });

  describe('_processRepository(repoName)', function(){
    it('should display error when repo is on the requested branch', function(){
      repo.getCurrentBranch().getName.returns('foo');

      dialog._processRepository('tada');

      dialog._renderRepository.args[0][0].should.equal("tada");
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it('should create and checkout to the new branch when branch does not exists', function(){
      repo.getLocalBranches().createEntity.returns(branch);

      repo.branchExistsLocallyOrAtSomeRemote.returns(false);

      dialog._processRepository('tada');

      repo.setCurrentBranch.alwaysCalledWith(branch).should.be.true;
      dialog._renderRepository.getCall(0).args[1].branch.should.be.eql(branch);
    });

    it('should checkout the remote branch when it is exists', function(){
      sinon.stub(dialog, '_createLocalBranchFromRemote', function(){ return branch; });

      repo.branchExistsLocallyOrAtSomeRemote.returns(true);
      repo.hasLocalBranch.returns(false);

      dialog._processRepository('tada');

      repo.setCurrentBranch.alwaysCalledWith(branch).should.be.true;
    });

    it('should checkout the local branch when it is exists', function(){
      repo.getLocalBranches().getEntity.returns(branch);

      repo.branchExistsLocallyOrAtSomeRemote.returns(true);
      repo.hasLocalBranch.returns(true);

      dialog._processRepository('tada');

      repo.setCurrentBranch.alwaysCalledWith(branch).should.be.true;
    });
  });
});
