require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../Stash');

describeUnitTest('Tada.Git.Command.Stash', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
      stash: sinon.stub(),
    }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.Stash', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });


  describe("#stash(res, data)", function() {
    it("should do a stash on the repo", function() {
      command.stash(null, { repo: "tada" });
      repo.stash.calledOnce.should.be.ok;
      (!repo.stash.args[0][0]).should.be.ok;
      repo.stash.args[0][1](null, true);

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should do a stash pop, apply or drop on the repo according to the arguments", function() {
      command.stash(null, { repo: "tada", option: "pop" });
      repo.stash.args[0][0].should.equal("pop");

      command.stash(null, { repo: "tada", option: "apply" });
      repo.stash.args[1][0].should.equal("apply");

      command.stash(null, { repo: "tada", option: "drop" });
      repo.stash.args[2][0].should.equal("drop");

      command.stash(null, { repo: "tada", option: "foobar" });
      repo.stash.calledOnce.should.not.be.ok;
      callback.calledOnce.should.be.ok;
      callback.args[0][0].should.be.ok;
    });

    it("should callback with error if error happened", function() {
      command.stash(null, { repo: "tada" });
      repo.stash.calledOnce.should.be.ok;

      repo.stash.args[0][1]("This is an error message");

      callback.calledOnce.should.be.ok;
      callback.args[0][0].should.equal("This is an error message");
    });

  });
});