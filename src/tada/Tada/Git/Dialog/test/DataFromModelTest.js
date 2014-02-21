require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/Widget');
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-framework/Consoloid/Test/UnitTest');
require('../AbstractDialog');
require('../DataFromModel');

describeUnitTest('Tada.Git.Dialog.DataFromModel', function() {
  var
    dialog,
    project,
    repo;

  beforeEach(function() {
    repo = {
      getCurrentBranch: sinon.stub().returns({
        mention: sinon.stub(),
        getAheadFromUpstream: sinon.stub().returns(false)
      }),
      mention: sinon.stub()
    }
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
    dialog = env.create('Tada.Git.Dialog.DataFromModel', { repositoryTemplateId: "Tada-Git-Dialog-ShowChange-Repo" });
  });

  describe('#_processRepository(repo)', function() {
    beforeEach(function() {
      dialog._renderRepository = sinon.stub();
      dialog._processRepository("tada");
    });

    it("should append the model from the project", function() {
      project.getRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][0].should.equal("tada");
      dialog._renderRepository.args[0][1].should.equal(repo);
    });

  });
});
