require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../ProcessFactory');

describeUnitTest('Tada.Git.Command.ProcessFactory', function() {
  var
    command,
    repository,
    resultCallback;

  defineNamespace('Consoloid.OS');

  beforeEach(function(){
    Consoloid.OS.Process = function(){};
    Consoloid.OS.Process.prototype.start = sinon.spy();

    repository = {
      path: 'foo/bar'
    };

    resultCallback = sinon.stub();

    command = env.create('Tada.Git.Command.ProcessFactory', {gitty: {}, commands: { ls:{ command: 'ls' }, wrong: {} }});
    sinon.stub(command, '__getResultCallback').returns(resultCallback);
    sinon.stub(command, 'getRepository').returns(repository);
  });

  describe('#execOnRepo(res, name, command)', function() {
    it('should throw an error if the given command does not exists', function(){
      (function(){ command.execOnRepo({}, { repo:'tada', commandName: 'unknow'}) }).should.throw(/unknow/);
    });

    it('should throw an error if the given command does not has a command property', function(){
      (function(){ command.execOnRepo({}, { repo:'tada', commandName: 'wrong'}) }).should.throw(/command property/);
    });

    it('should create a Process with the command and the repo path', function(){
      sinon.spy(command, 'create');

      command.execOnRepo({}, { repo:'tada', commandName: 'ls'});
      command.create.calledWith('Consoloid.OS.Process', {
        container: env.container,
        command: 'ls',
        args: [],
        spawnOptions: {
          cwd: 'foo/bar'
        },
        onClose: resultCallback,
        onError: resultCallback
      }).should.be.true;
    });

    it('should start the process', function(){
      command.execOnRepo({}, { repo:'tada', commandName: 'ls'});
      Consoloid.OS.Process.prototype.start.calledOnce.should.be.true;
    });
  });

  afterEach(function(){
    Consoloid.OS.Process = undefined;
  });
});