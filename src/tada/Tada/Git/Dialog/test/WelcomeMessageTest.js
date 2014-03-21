require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../ShowVersionControlSummary');
require('../UpdateVersionControlInfo');
require('../WelcomeMessage');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.WelcomeMessage', function() {
  var
    tada,
    dialog,
    consoleService,
    queues;

  beforeEach(function() {
    tada = { getConfig: sinon.stub().returns({}) };
    env.addServiceMock('tada', tada);

    env.addServiceMock('dialogLauncher', { createGoogleAnalyticsObjectAndSendFirstPageView: sinon.stub() });

    dialog = env.create('Tada.Git.Dialog.WelcomeMessage', {});
    sinon.stub(dialog.template, 'get', function(){});
    sinon.stub(dialog.responseTemplate, 'get', function(){});
    sinon.stub(dialog, '_animateDialogShowup', function(){});
    sinon.stub(dialog, '_bindEventListeners', function(){});

    consoleService = { createNewDialog: sinon.stub() };
    env.addServiceMock('console', consoleService);

    var
      returnJqueryObjectStub = sinon.stub(),
      jqueryObject = {
        empty: returnJqueryObjectStub,
        jqoteapp: returnJqueryObjectStub,
        find: returnJqueryObjectStub
      };

    returnJqueryObjectStub.returns(jqueryObject);
    consoleService.createNewDialog.returns(jqueryObject);
  });

  describe('#setup()', function(){
    it('should set the name property from the tada config', function(){
      tada.getConfig.withArgs('server/name').returns('Test');

      dialog.setup();

      dialog.name.should.be.eql('Test');
    });

    it('should create own dom node', function(){
      dialog.setup();

      dialog.node.should.be.ok;
    });
  });

  describe('#render()', function(){
    var
      project,
      refresh;
    beforeEach(function(){
      refresh = sinon.stub();
      project = {
        getRepository: sinon.stub()
      }
      env.addServiceMock('git.project', project);
      queues = {
        getQueue: sinon.stub().returns({
          refresh: refresh
        }),
      }
      env.addServiceMock('git.repository.command.queues', queues);

      dialog.name = "Test";
      dialog.node = consoleService.createNewDialog();
      dialog.requestedRepositories = [ "tada", "that-other-repo" ];
      dialog.render();
    })

    it('should not render the expression part', function(){
      (dialog.expression == null).should.be.true;
      dialog.response.should.be.ok;
    });

    it('should set the document title to include the project name', function(){
      document.title.indexOf('Test').should.be.above(-1);
      document.title = undefined;
    });

  });
});
