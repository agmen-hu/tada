require('../Supervisor');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Tada.Server.Supervisor', function() {
  var
    supervisor,
    tadaConfig,
    childProcessModule,
    httpModule;

  beforeEach(function() {
    tadaConfig = {
      get: sinon.stub()
    };

    tadaConfig.get.withArgs('server/port').returns('35999');

    childProcessModule = {
      spawn: sinon.stub(),
      exec: sinon.stub()
    };

    httpModule = {
      request: sinon.stub()
    };

    supervisor = env.create('Tada.Server.Supervisor', {
      tadaConfig: tadaConfig,
      childProcessModule: childProcessModule,
      httpModule: httpModule
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
      childProcessModule.spawn.args[0][0].should.be.equal(process.argv[0]);
      childProcessModule.spawn.args[0][1][0].should.be.equal(process.argv[1]);
      childProcessModule.spawn.args[0][1][1].should.be.equal('server-foreground');
      childProcessModule.spawn.args[0][1][2].should.be.equal('prod');
      childProcessModule.spawn.args[0][1][3].should.match(/\/tmp\/tada-.*\.log/);
    });

    it('should detach child and also unref it', function() {
      sinon.stub(console, 'log');
      supervisor.spawnServer();
      console.log.restore();

      childProcessModule.spawn.args[0][2].should.have.property('detached', true);
      child.unref.calledOnce.should.be.true;
    });
  });

  describe("#stopServer()", function() {
   var res;
    beforeEach(function() {
      supervisor.isServerRunning = sinon.stub().returns(true);
      httpModule.request.returns({
        end: sinon.stub()
      });

      res = {
        on: sinon.stub()
      }

      supervisor.stopServer();
    });

    it("should get Pid of running server", function() {
      supervisor.isServerRunning.calledOnce.should.be.ok;
      supervisor.isServerRunning.args[0][0](null, true);

      httpModule.request.calledOnce.should.be.ok;
      httpModule.request.args[0][0].should.equal("http://localhost:35999/pid");
      httpModule.request.args[0][1](res);

      res.on.calledOnce.should.be.ok;
      res.on.args[0][0].should.equal("data");
    });

    it("should kill the running server", function() {
      supervisor.isServerRunning.args[0][0](null, true);
      httpModule.request.args[0][1](res);
      res.on.args[0][1]("31337");

      childProcessModule.exec.calledOnce.should.be.ok;
      childProcessModule.exec.args[0][0].should.equal("kill 31337");

    });

    it("should not attempt to connect to a server, if it wasn't running", function() {
      supervisor.isServerRunning.args[0][0](null, false);
      httpModule.request.called.should.not.be.ok;
    });

    it("should throw error if kill encountered an error", function() {
      supervisor.isServerRunning.args[0][0](null, true);
      httpModule.request.args[0][1](res);
      res.on.args[0][1]("31337");

      childProcessModule.exec.calledOnce.should.be.ok;
      childProcessModule.exec.args[0][0].should.equal("kill 31337");

      (function() {
        childProcessModule.exec.args[0][1]("An error");
      }).should.throw().should.be.ok;

      (function() {
        childProcessModule.exec.args[0][1](null, null, "An error");
      }).should.throw().should.be.ok;
    });
  });
});
