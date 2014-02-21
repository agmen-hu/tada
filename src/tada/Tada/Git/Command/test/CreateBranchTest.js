require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../CreateBranch');

describeUnitTest('Tada.Git.Command.CreateBranch', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
      branch: sinon.stub(),
    }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.CreateBranch', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });


  describe("#branch(res, data)", function() {
    it("should create a new branch on the repo", function() {
      command.branch(null, { repo: "tada", branch: "fooBranch" });
      repo.branch.calledOnce.should.be.ok;
      repo.branch.args[0][0].should.equal("fooBranch")

      repo.branch.args[0][1](null, true);

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with error if error happened", function() {
      command.branch(null, { repo: "tada", branch: "fooBranch" });
      repo.branch.calledOnce.should.be.ok;

      repo.branch.args[0][1]("This is an error message");

      callback.calledOnce.should.be.ok;
      callback.args[0][0].should.equal("This is an error message");
    });

  });
});