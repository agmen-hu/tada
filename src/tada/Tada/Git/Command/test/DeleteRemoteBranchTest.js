require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../DeleteRemoteBranch');

describeUnitTest('Tada.Git.Command.DeleteRemoteBranch', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
        push: sinon.stub(),
      }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.DeleteRemoteBranch', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });


  describe("#delete(res, data)", function() {
    it("should delete remote branch from repo", function() {
      command.delete(null, { branch: "foobranch", remote: "origin", repo: "tada" });
      repo.push.calledOnce.should.be.ok;
      repo.push.args[0][0].should.equal("origin");
      repo.push.args[0][1].should.equal(":foobranch");

      repo.push.args[0][2](null, true);

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with error if repo, branch or remote request argument is missing", function() {
      command.delete(callback, { branch: "foobranch", remote: "origin" });
      repo.push.called.should.not.be.ok;
      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.not.be.ok;

      command.delete(callback, { remote: "origin", repo: "tada" });
      repo.push.called.should.not.be.ok;
      callback.calledTwice.should.be.ok;
      (callback.args[1][0] == undefined).should.not.be.ok;

      command.delete(callback, { branch: "foobranch", repo: "tada" });
      repo.push.called.should.not.be.ok;
      callback.callCount.should.equal(3);
      (callback.args[2][0] == undefined).should.not.be.ok;
    });

  });
});
