require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../Push');

describeUnitTest('Tada.Git.Command.Push', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
        push: sinon.stub(),
      }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.Push', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });


  describe("#push(res, data)", function() {
    it("should push branch to repo", function() {
      command.push(null, { branch: "foobranch", remote: "master", repo: "tada" });
      repo.push.calledOnce.should.be.ok;
      repo.push.args[0][0].should.equal("master");
      repo.push.args[0][1].should.equal("foobranch");

      repo.push.args[0][2](null, true);

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with error if no repo, branch or remote was added", function() {
      command.push(callback, { branch: "foobranch", remote: "master" });
      repo.push.called.should.not.be.ok;
      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.not.be.ok;

      command.push(callback, { remote: "master", repo: "tada" });
      repo.push.called.should.not.be.ok;
      callback.calledTwice.should.be.ok;
      (callback.args[1][0] == undefined).should.not.be.ok;

      command.push(callback, { branch: "foobranch", repo: "tada" });
      repo.push.called.should.not.be.ok;
      callback.callCount.should.equal(3);
      (callback.args[2][0] == undefined).should.not.be.ok;
    });

  });
});