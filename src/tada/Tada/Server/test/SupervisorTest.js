require('../Supervisor');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Tada.Server.Supervisor', function() {
  var
    supervisor,
    tadaConfig,
    childProcessModule;

  beforeEach(function() {
    tadaConfig = {
      get: sinon.stub()
    };

    tadaConfig.get.withArgs('server/port').returns('35999');

    childProcessModule = {
      spawn: sinon.stub()
    };

    supervisor = env.create('Tada.Server.Supervisor', {
      tadaConfig: tadaConfig,
      childProcessModule: childProcessModule
    });
  });

  describe('#isServerRunning(callback)', function() {
    it('should return false when server is not listening on port specified in project.conf', function(done) {
      supervisor.isServerRunning(function(err, result) {
        result.should.be.false;
        tadaConfig.get.called.should.be.true;
        tadaConfig.get.calledWith('server/port').should.be.true;
        done();
      });
    });

    it('should return true when server is listening on port specified in project.conf', function(done) {
      var server = require('net').createServer({});
      server.listen(35999);

      supervisor.isServerRunning(function(err, result) {
        server.close();
        result.should.be.true;
        tadaConfig.get.called.should.be.true;
        tadaConfig.get.calledWith('server/port').should.be.true;
        done();
      });
    });
  });

  describe('#spawnServer()', function() {
    var
      child;

    beforeEach(function() {
      child = {
        unref: sinon.spy()
      };

      childProcessModule.spawn.returns(child);
    });

    it('should start child process with same command but server as argument', function() {
      sinon.stub(console, 'log');
      supervisor.spawnServer();
      console.log.restore();

      childProcessModule.spawn.calledOnce.should.be.true;
      childProcessModule.spawn.calledWith(process.argv[0], [ process.argv[1], 'server-foreground' ]).should.be.true;
    });

    it('should detach child and also unref it', function() {
      sinon.stub(console, 'log');
      supervisor.spawnServer();
      console.log.restore();

      childProcessModule.spawn.args[0][2].should.have.property('detached', true);
      child.unref.calledOnce.should.be.true;
    });
  });
});