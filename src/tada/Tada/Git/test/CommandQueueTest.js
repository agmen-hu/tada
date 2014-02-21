require('consoloid-framework/Consoloid/Test/UnitTest');
require('../CommandQueue');

describeUnitTest('Tada.Git.CommandQueue', function() {
  var
    callback,
    commandQueue,
    queue,
    async;

  beforeEach(function() {
    queue = {
      add: sinon.stub()
    }
    env.addServiceMock('async_function_queue', queue);

    commandQueue = env.create('Tada.Git.CommandQueue', { });
    callback = sinon.stub();
  });

  describe("#__constructor(options)", function() {
    it("should acquire a function queue", function() {
      commandQueue.queue.should.equal(queue);
    });
  });

  describe("#refresh(callback, repo)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.initial_info', remoteService);

      project = {
        update: sinon.stub()
      }
      env.addServiceMock('git.project', project);
    });

    it("should push the refresh task to the queue", function() {
      commandQueue.refresh(callback, "tada", ["a task"]);

      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      queue.add.args[0][2].tasks[0].should.equal("a task");
    });

    it("should atempt to get the initial info and refresh the model", function() {
      commandQueue.refresh(callback, "tada");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;

      project.update.calledOnce.should.be.ok;
      project.update.args[0][0].should.equal("tada");
      project.update.args[0][1].foo.should.equal("bar");

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with an error if the initial info call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      commandQueue.refresh(callback, "tada");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

  describe("#push(callback, repo)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.push', remoteService);
    });

    it("should push the push task to the queue", function() {
      commandQueue.push(callback, "tada", "origin", "master");

      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      queue.add.args[0][2].branch.should.equal("master");
      queue.add.args[0][2].remote.should.equal("origin");
    });

    it("should atempt to push a branch", function() {
      commandQueue.push(callback, "tada", "origin", "master");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with an error if the initial info call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      commandQueue.push(callback, "tada", "origin", "master");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

  describe("#fetch(callback, repo, prune)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.fetch', remoteService);
    });

    it("should push the fetch task to the queue", function() {
      commandQueue.fetch(callback, "tada");

      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      (!queue.add.args[0][2].prune).should.be.ok;
    });

    it("should atempt to fetch a branch", function() {
      commandQueue.fetch(callback, "tada");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should set prune if prune was set", function() {
      commandQueue.fetch(callback, "tada", true);
      queue.add.args[0][2].prune.should.be.ok;
    });

    it("should callback with an error if the fetch call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      commandQueue.fetch(callback, "tada");
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

  describe("#createBranch(callback, repo, branch)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.create.branch', remoteService);
      commandQueue.createBranch(callback, "tada", "foobranch");
    });

    it("should push the branch creation task to the queue", function() {
      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      queue.add.args[0][2].branch.should.equal("foobranch");
    });

    it("should atempt to create a branch", function() {
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with an error if the branch creation call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

  describe("#deleteRemoteBranch(callback, repo, remote, branch)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.delete.remote.branch', remoteService);
      commandQueue.deleteRemoteBranch(callback, "tada", "origin", "foobranch");
    });

    it("should push the remote branch removal task to the queue", function() {
      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      queue.add.args[0][2].remote.should.equal("origin");
      queue.add.args[0][2].branch.should.equal("foobranch");
    });

    it("should atempt to remove remote a branch", function() {
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;
      remoteService.callAsync.calledWith("delete").should.be.ok;

      callback.calledOnce.should.be.ok;
      (callback.args[0][0] == undefined).should.be.ok;
    });

    it("should callback with an error if the branch removal call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

  describe("#stash(callback, repo, option)", function() {
    var
      remoteService,
      project;
    beforeEach(function() {

      remoteService = {
        callAsync: sinon.spy(function() {
          arguments[2].success({ foo: "bar" });
        })
      }
      env.addServiceMock('git.command.stash', remoteService);
      commandQueue.stash(callback, "tada", "foooption");
    });

    it("should push the stash task to the queue", function() {
      queue.add.calledOnce.should.be.ok;
      queue.add.args[0][0].should.equal(callback);
      (queue.add.args[0][1] instanceof Function).should.be.ok;
      queue.add.args[0][2].repo.should.equal("tada");
      queue.add.args[0][2].option.should.equal("foooption");
    });

    it("should atempt to do the stash", function() {
      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      remoteService.callAsync.calledOnce.should.be.ok;
      remoteService.callAsync.calledWith("stash").should.be.ok;

      callback.calledOnce.should.be.ok;
      callback.args[0][1].foo.should.be.ok;
    });

    it("should callback with an error if the branch removal call failed", function() {
      remoteService.callAsync = function() {
        arguments[2].error({ foo: "bar" });
      };

      queue.add.args[0][1](
        queue.add.args[0][0],
        queue.add.args[0][2]
      );

      callback.called.should.be.ok;
      callback.args[0][0].should.be.ok;
    });
  });

});
