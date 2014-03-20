require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/Widget');
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../AbstractDialog');
require('../../Error/UserMessage');

describeUnitTest('Tada.Git.Dialog.AbstractDialog', function() {
  var
    tada,
    Dialog,
    repo,
    remoteService,
    repositoryTemplate;

  beforeEach(function() {

    repositoryTemplate = {
      get: sinon.stub()
    };

    tada = {
      getConfig: sinon.stub().returns({'tada':{}, 'foo':{}})
    }
    env.addServiceMock('tada', tada);

    repo = {
      mention: sinon.stub()
    }
    env.addServiceMock('git.project', {
      getRepository: sinon.stub().returns(repo)
    });

    Dialog = env.create('Tada.Git.Dialog.AbstractDialog', { repositoryTemplate: repositoryTemplate, remoteMethod: 'foo' });
    Dialog.arguments = {};
    Dialog._renderExpressionAndResponse = function(){};
    Dialog._animateDialogShowup = function(){};
    Dialog._bindEventListeners = function(){};
  });

  describe('#__construct(options)', function() {
    it('should require a repositoryTemplateId property if repositoryTemplate does not exist', function(){
      (function(){ env.create('Tada.Git.Dialog.AbstractDialog', { remoteMethod: 'foo' } ); }).should.throw();
    });

    it('should create the repositoryTemplate if the repositoryTemplateId is present', function(){
      Dialog = env.create('Tada.Git.Dialog.AbstractDialog', { remoteMethod: 'foo', repositoryTemplateId: 'alma'} );
      Dialog.repositoryTemplate.should.be.ok;
    });
  });

  describe('#setup()', function(){
    it('should set the requestedRepositories if the repo argument is filled', function(){
      Dialog.arguments.repo = { value: 'tada' };

      Dialog.setup();

      Dialog.requestedRepositories.should.be.eql(['tada']);
    });

    it('should fill the requestedRepositories with the all repository if the repo argument is missing', function(){
      Dialog.setup();
      Dialog.requestedRepositories.should.be.eql(['tada', 'foo'])
    });

    it("should attempt to mention repo if the argument was set", function() {
      Dialog.arguments.repo = { value: 'tada' };
      Dialog.setup();

      repo.mention.calledOnce.should.be.ok;
    });
  });

  describe("#__processRequestedRepositories()", function() {
    it("Should render an error if error was thrown inside _processRepository", function() {
      Dialog.arguments.repo = { value: 'tada' };
      Dialog.setup();

      Dialog._renderRepository = sinon.stub();
      Dialog._processRepository = sinon.stub().throws(new Tada.Git.Error.UserMessage({ message: "Rampamparam" }));
      Dialog.__processRequestedRepositories();

      Dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });
  })
});
