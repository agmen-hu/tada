require('consoloid-framework/Consoloid/Widget/Widget');
require('consoloid-console/Consoloid/Ui/Dialog');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../AbstractDialog');
require('../DataFromServer');

describeUnitTest('Tada.Git.Dialog.DataFromServer', function() {
  var
    tada,
    Dialog,
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

    remoteService = {
      callAsync: sinon.stub()
    }
    env.addServiceMock('git.command.info', remoteService);

    Dialog = env.create('Tada.Git.Dialog.DataFromServer', { repositoryTemplate: repositoryTemplate, remoteMethod: 'foo', remoteService: "git.command.info" });
    Dialog.arguments = {};
    Dialog._renderExpressionAndResponse = function(){};
    Dialog._animateDialogShowup = function(){};
    Dialog._bindEventListeners = function(){};
  });

  describe('#__construct(options)', function() {
    it('should require a remoteMethod property', function(){
      (function(){ env.create('Tada.Git.Dialog.DataFromServer', { repositoryTemplate: repositoryTemplate }); }).should.throw();
    });
  });

  describe('#render()', function(){
    it('should render call the remote service with each repository', function(){
      sinon.stub(Dialog, '_renderRepository');
      remoteService.callAsync.yieldsTo('success', 'alma')

      Dialog.setup();
      Dialog.render();

      remoteService.callAsync.calledTwice.should.be.true;
      remoteService.callAsync.firstCall.calledWith('foo',  [{ repo: 'tada'}]).should.be.true;
      remoteService.callAsync.secondCall.calledWith('foo', [{ repo: 'foo'}]).should.be.true;

      Dialog._renderRepository.calledTwice.should.be.true;
    });
  });

  describe('#__generateRequestArguments(repositoryName)', function(){
    it('should create a plain object with all expression arguments and the given repo name', function(){
      Dialog.arguments.repo = { value: 'foo' };
      Dialog.arguments.branch = { value: 'alma' };
      Dialog.arguments.remote = { value: 'origin' };

      var values = Dialog.__generateRequestArguments('tada');
      values.should.eql({
        repo: 'tada',
        branch: 'alma',
        remote: 'origin'
      });
    });
  });
});
