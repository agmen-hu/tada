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

require('../Switch');

describeUnitTest('Tada.Git.Dialog.Branch.Switch', function() {
  var
    repo,
    branch,
    dialog,
    checkoutResponse;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Branch.Switch', { arguments: {} });
    dialog.arguments.branch = { value: 'foo' };
    dialog._renderRepository = sinon.stub();

    branch = env.mock('Tada.Git.Entity.RemoteBranch');
    repo = env.mock('Tada.Git.Entity.Repository');
    repo.getName.returns('tada');
    repo.getLocalBranches.returns(env.mock('Consoloid.Entity.Repository'));
    repo.getCurrentBranch.returns(env.mock('Tada.Git.Entity.Branch'));

    var project = env.mock('Tada.Git.Entity.Project');
    project.getRepository.returns(repo);
    env.addServiceMock('git.project', project);

    checkoutResponse = {};
    env.addServiceMock('git.repository.command.queues', {getQueue: sinon.stub().returns({
      checkout: function(cb) { cb(checkoutResponse); }
    })});

    repo.branchIsExists.returns(true);

    repo.getLocalBranches().hasEntity.returns(true);
    repo.getLocalBranches().getEntity.returns(branch);
  });

  describe("#_processRepository(repoName)", function() {
    it('should display error when repo is on the requested branch', function(){
      repo.getCurrentBranch().getName.returns('foo');

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'Already on foo' }).should.be.true;
      repo.setCurrentBranch.called.should.be.false;
    });

    it('should switch to the requested branch', function(){
      dialog._processRepository('tada');

      repo.getLocalBranches().getEntity.alwaysCalledWith('foo').should.be.true;
      repo.setCurrentBranch.alwaysCalledWith(branch).should.be.true;
      dialog._renderRepository.alwaysCalledWith('tada', { error: undefined, branch:branch, repo: repo, forcedToMaster: false}).should.be.true;
    });

    it('should not switch to the requested branch when error occurd', function(){
      checkoutResponse.err = 'error!';

      dialog._processRepository('tada');

      repo.setCurrentBranch.called.should.be.false;

      dialog._renderRepository.alwaysCalledWith('tada', { error: 'error!', branch:undefined, repo: repo, forcedToMaster: false}).should.be.true;
    });

    it('should switch to master the master when branch does not exists', function(){
      repo.branchIsExists.returns(false);

      dialog._processRepository('tada');

      dialog._renderRepository.alwaysCalledWith('tada', { error: undefined, branch:branch, repo: repo, forcedToMaster: true}).should.be.true;
      repo.getLocalBranches().getEntity.alwaysCalledWith('master').should.be.true;
    });

    it('should create the local branch when checkouted from an remote', function(){
      branch.getLocalName.returns('foo');
      repo.getLocalBranches().createEntity.returns(branch);

      repo.getLocalBranches().hasEntity.returns(false);

      repo.getRemoteBranches.returns(env.mock('Consoloid.Entity.Repository'));
      repo.getRemoteBranches().some.yields(branch);

      dialog._processRepository('tada');

      var newBranchData = repo.getLocalBranches().createEntity.args[0][0];
      newBranchData.name.should.be.eql('foo');
      newBranchData.upstream.should.be.eql(branch);
      newBranchData.commits.should.be.eql([ undefined ]);

      repo.setCurrentBranch.calledOnce.should.be.true;
    });
  });
});
