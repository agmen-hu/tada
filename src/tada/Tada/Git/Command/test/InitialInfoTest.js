require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../Command/OutputParser/RefList');
require('../../AbstractServerSideService');
require('../InitialInfo');

describeUnitTest('Tada.Git.Command.InitialInfo', function() {
  var
    initialInfo;

  describe("#__constructor(options)", function() {
    it("should set default parameters for for-each-ref", function() {
      initialInfo = env.create('Tada.Git.Command.InitialInfo', {});
      initialInfo.forEachRefArguments['--sort'].should.be.ok;
      initialInfo.forEachRefArguments['--format'].should.be.ok;
    });
  });

  describe("#getInfo(callback, data)", function() {
    var
      repo,
      callback,
      parser,
      queue,
      callNextAddedQueueItem;

    beforeEach(function() {
      queue = {
        add: sinon.stub(),
        setDrain: sinon.stub(),
        killQueue: sinon.stub()
      }
      env.addServiceMock('async_function_queue', queue);

      repo = {
          remoteList: sinon.stub(),
          status: sinon.stub(),
          forEachRef: sinon.stub()
        }
      callback = sinon.stub();

      parser = env.mock('Tada.Git.Command.OutputParser.RefList');
      parser.parse.returns({ foo: "bar-parsed"});

      initialInfo = env.create('Tada.Git.Command.InitialInfo', { });
      initialInfo.create = sinon.stub().returns(parser);
      initialInfo.__getResultCallback = sinon.stub().returns(callback);

      nextQueueItem = 0;
      callNextAddedQueueItem = function() {
        if (queue.add.args[nextQueueItem]) {
          queue.add.args[nextQueueItem][1](queue.add.args[nextQueueItem][0] || sinon.stub(), queue.add.args[nextQueueItem][2]);
          nextQueueItem++;
          return;
        }

        (queue.setDrain.args[0][0] || sinon.stub())();
      }
    });

    it("should return data from gitty and for-each-ref", function() {
      initialInfo.getRepository = sinon.stub().returns(repo);

      initialInfo.getInfo(callback, { repo: "fooRepo" });

      callNextAddedQueueItem();
      repo.remoteList.calledOnce.should.be.ok;
      repo.remoteList.args[0][0](null, { foo: "bar-remotes" });

      callNextAddedQueueItem();
      repo.status.calledOnce.should.be.ok;
      repo.status.args[0][0](null, { foo: "bar-status" });

      callNextAddedQueueItem();
      repo.forEachRef.calledOnce.should.be.ok;
      ('refs/heads' in repo.forEachRef.args[0][0]).should.be.ok;
      ('refs/remotes' in repo.forEachRef.args[0][0]).should.not.be.ok;
      ('--perl' in repo.forEachRef.args[0][0]).should.be.ok;
      repo.forEachRef.args[0][1](null, { foo: "bar-localref" });

      callNextAddedQueueItem();
      repo.forEachRef.calledTwice.should.be.ok;
      ('refs/heads' in repo.forEachRef.args[1][0]).should.not.be.ok;
      ('refs/remotes' in repo.forEachRef.args[1][0]).should.be.ok;
      ('--perl' in repo.forEachRef.args[1][0]).should.be.ok;

      callback.called.should.not.be.ok;

      repo.forEachRef.args[1][1](null, { foo: "bar-remoteref" });

      callNextAddedQueueItem();
      parser.parse.calledOnce.should.be.ok;
      parser.parse.args[0][0].foo.should.equal("bar-localref");
      parser.parse.args[0][1].foo.should.equal("bar-remoteref");

      callNextAddedQueueItem();
      callback.calledOnce.should.be.ok;

      callback.args[0][1].status.foo.should.equal("bar-status");
      callback.args[0][1].remotes.foo.should.equal("bar-remotes");
      callback.args[0][1].foo.should.equal("bar-parsed");
    });

    it("should work with seperate incoming requests", function() {
      var repo2 = {
        remoteList: sinon.stub(),
      }
      initialInfo.getRepository = sinon.stub();
      initialInfo.getRepository.withArgs("fooRepo").returns(repo);
      initialInfo.getRepository.withArgs("barRepo").returns(repo2);

      initialInfo.getInfo(callback, { repo: "fooRepo" });
      initialInfo.getInfo(callback, { repo: "barRepo" });
      callNextAddedQueueItem();
      repo.remoteList.calledOnce.should.be.ok;
      repo2.remoteList.called.should.not.be.ok;
    });

    it("should be able to kill the queue, and send error on an error", function() {
      initialInfo.getRepository = sinon.stub().returns(repo);
      initialInfo.getInfo(callback, { repo: "fooRepo" });

      callNextAddedQueueItem();
      repo.remoteList.args[0][0]("A terrible error message");
      callback.calledOnce.should.be.ok;
      callback.args[0][0].should.be.ok;
      queue.killQueue.called.should.be.ok;
    });

    it("should accept a list of things to do instead of doing everything", function() {
      initialInfo.getRepository = sinon.stub().returns(repo);
      initialInfo.getInfo(callback, { repo: "fooRepo", tasks: ["status", "remotes", "localRefList", "remoteRefList"] });

      callNextAddedQueueItem(); //status
      callNextAddedQueueItem(); //remotes
      callNextAddedQueueItem(); //localRefList
      callNextAddedQueueItem(); //remoteRefList
      callNextAddedQueueItem(); //parsing ref lists

      repo.remoteList.calledOnce.should.be.ok;
      repo.status.calledOnce.should.be.ok;
      repo.forEachRef.calledTwice.should.be.ok;

      initialInfo.getInfo(callback, { repo: "fooRepo", tasks: ["status", "remoteRefList"] });

      callNextAddedQueueItem(); //status
      callNextAddedQueueItem(); //remoteRefList
      callNextAddedQueueItem(); //parsing ref lists

      repo.remoteList.calledOnce.should.be.ok;
      repo.status.calledTwice.should.be.ok;
      repo.forEachRef.calledThrice.should.be.ok;

      initialInfo.getInfo(callback, { repo: "fooRepo", tasks: ["remotes", "status"] });

      callNextAddedQueueItem(); //remotes
      callNextAddedQueueItem(); //status

      repo.remoteList.calledTwice.should.be.ok;
      repo.status.calledThrice.should.be.ok;
      repo.forEachRef.calledThrice.should.be.ok;
    });
  });
});
