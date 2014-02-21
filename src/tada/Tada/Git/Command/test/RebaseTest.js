require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../Rebase');

describeUnitTest('Tada.Git.Command.Rebase', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
        rebase: sinon.stub(),
      }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.Rebase', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });

  describe("#rebase(res, data)", function() {
    it("should do a rebase on the repo", function() {
      repo.rebase.callsArgWith(1, undefined, "alma korte");
      command.rebase(null, { repo: "tada", branch: "master" });
      repo.rebase.calledOnce.should.be.true;

      callback.calledOnce.should.be.true;
      callback.alwaysCalledWith(undefined).should.be.true;
    });

    describe('when should call the callback with error', function(){
      function callRebaseWithOutput(message)
      {
        repo.rebase.callsArgWith(1, undefined, message);
        command.rebase(null, { repo: "tada", branch: "master" });
        repo.rebase.calledOnce.should.be.true;

        callback.calledOnce.should.be.true;
        callback.alwaysCalledWith(message).should.be.true;
      }
      it("when patch faild", function() {
        callRebaseWithOutput('alma korte\nPatch failed at');
      });

      it("when cannot rebase error occurd", function() {
        callRebaseWithOutput('Cannot rebase because of....');
      });

      it("when branch is up to date", function() {
        callRebaseWithOutput('Current branch is up to date');
      });
    });
  });
});
