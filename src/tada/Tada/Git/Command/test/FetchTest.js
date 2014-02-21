require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../Fetch');

describeUnitTest('Tada.Git.Command.Fetch', function() {
  var
    command,
    repo;
  beforeEach(function() {
    repo = {
      fetch: sinon.stub(),
    }
    callback = sinon.stub();

    command = env.create('Tada.Git.Command.Fetch', {});
    command.__getResultCallback = sinon.stub().returns(callback);
    command.getRepository = sinon.stub().returns(repo);
  });


  describe("#fetch(res, data)", function() {
    it("should do a fetch on the repo", function() {
      command.fetch(null, { repo: "tada" });
      repo.fetch.calledOnce.should.be.ok;
      (!repo.fetch.args[0][1]).should.be.ok;
      repo.fetch.args[0][0](null, true);

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should add the --prune option if prune was set", function() {
      command.fetch(null, { repo: "tada", prune: "true" });
      repo.fetch.calledOnce.should.be.ok;
      repo.fetch.args[0][1].should.be.ok;
      repo.fetch.args[0][0](null, true);
    });

    it("should callback with error if error happened", function() {
      command.fetch(null, { repo: "tada" });
      repo.fetch.calledOnce.should.be.ok;

      repo.fetch.args[0][0]("This is an error message");

      callback.calledOnce.should.be.ok;
      callback.args[0][0].should.equal("This is an error message");
    });

  });
});