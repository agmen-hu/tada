require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../Fetch');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.Fetch', function() {
  var
    dialog,
    repo,
    fetch,
    refresh,
    project,
    contextForgetter;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.Fetch', { arguments: {} });
    dialog._renderRepository = sinon.stub();

    originalRemoteBranches = {
      data: [{
        getLatestCommit: sinon.stub().returns({
          getHash: sinon.stub().returns("fooHash")
        }),
        getName: sinon.stub().returns("fooName")
      }, {
        getLatestCommit: sinon.stub().returns({
          getHash: sinon.stub().returns("barHash")
        }),
        getName: sinon.stub().returns("barName")
      }],
      forEach: function(callback) {
        this.data.forEach(callback, this);
      }
    }
    repo = {
      getRemoteBranches: sinon.stub().returns(originalRemoteBranches),
      getRemotes: sinon.stub().returns({
        getEntityCount: sinon.stub().returns(1)
      })
    }

    refresh = sinon.spy();
    fetch = sinon.stub().returns({ refresh: refresh });

    queues = {
      getQueue: sinon.stub().returns({
        createChildQueue: sinon.stub().returns({
          fetch: fetch,
          killQueue: sinon.spy()
        })
      })
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);

    contextForgetter = {
      remoteBranch: sinon.stub()
    }
    env.addServiceMock('git.context.forgetter', contextForgetter);
  });

  describe("#_processRepository()", function() {
    it('should fetch, and render the changes', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      fetch.calledOnce.should.be.ok;
      fetch.args[0][1].should.equal("tada")
      fetch.args[0][2].should.not.be.ok;
      fetch.args[0][0]();

      refresh.calledOnce.should.be.ok;
      refresh.args[0][1].should.equal("tada")
      //refresh.args[0][2][0].should.equal("remoteRefList")

      repo.getRemoteBranches.returns({
        data: [{
          getLatestCommit: sinon.stub().returns({
            getHash: sinon.stub().returns("foobarHash")
          }),
          getName: sinon.stub().returns("fooName"),
          mention: sinon.stub()
        }, {
          getLatestCommit: sinon.stub().returns({
            getHash: sinon.stub().returns("barfooHash")
          }),
          getName: sinon.stub().returns("foobarName"),
          mention: sinon.stub()
        }],
        getEntity: sinon.stub().returns({
          mention: sinon.stub()
        }),
        forEach: function(callback) {
          this.data.forEach(callback, this);
        }
      });

      refresh.args[0][0]();

      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].embed.data.removedBranches[0].should.equal("barName");
      dialog._renderRepository.args[0][1].embed.data.updatedBranches[0].should.equal("fooName");
      dialog._renderRepository.args[0][1].embed.data.newBranches[0].should.equal("foobarName");
      dialog._renderRepository.args[0][1].embed.data.repo.should.equal(repo);
    });

    it("should send prune argument", function() {
      dialog.arguments['prune'] = {
        value: true
      }
      dialog._processRepository("tada");
      fetch.args[0][2].should.be.ok;
    });

    it("should not attempt fetch if there are no remotes in model", function() {
      repo.getRemotes().getEntityCount.returns(0);
      dialog._processRepository("tada");

      fetch.called.should.not.be.ok;

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      (dialog._renderRepository.args[0][1].repo == undefined).should.be.ok;
    });

    it("should mention and forget the changes", function() {
      dialog._processRepository("tada");

      fetch.args[0][0]();
      repo.getRemoteBranches.returns({
        data: [{
          getLatestCommit: sinon.stub().returns({
            getHash: sinon.stub().returns("foobarHash")
          }),
          getName: sinon.stub().returns("fooName"),
          mention: sinon.stub()
        }, {
          getLatestCommit: sinon.stub().returns({
            getHash: sinon.stub().returns("barfooHash")
          }),
          getName: sinon.stub().returns("foobarName"),
          mention: sinon.stub()
        }],
        getEntity: function(name) {
          if (name == "fooName") {
            return repo.getRemoteBranches().data[0]
          }
          if (name == "foobarName") {
            return repo.getRemoteBranches().data[1]
          }
        },
        forEach: function(callback) {
          this.data.forEach(callback, this);
        }
      });
      refresh.args[0][0]();

      repo.getRemoteBranches().getEntity("fooName").mention.called.should.be.ok;
      repo.getRemoteBranches().getEntity("foobarName").mention.calledOnce.should.be.ok;
      contextForgetter.remoteBranch.calledWith("barName").should.be.ok;
    })

    it('should render error if servere called back with one', function() {
      dialog._processRepository("tada");
      fetch.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      (dialog._renderRepository.args[0][1].repo == undefined).should.be.ok;

      fetch.args[0][0]();
      refresh.args[0][0]("OMG another one");
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      (dialog._renderRepository.args[1][1].repo == undefined).should.be.ok;
    });
  });
});
