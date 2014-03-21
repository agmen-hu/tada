require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../AbstractDialog');
require('../PushBranch');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Git.Dialog.PushBranch', function() {
  var
    dialog,
    repo,
    push,
    project,
    queues;

  beforeEach(function() {
    dialog = env.create('Tada.Git.Dialog.PushBranch', { arguments: {} });
    dialog._renderRepository = sinon.stub();

    push = sinon.stub();
    repo = {
      getCurrentBranch: sinon.stub().returns({
        getName: sinon.stub().returns("master")
      }),
      getLocalBranches: sinon.stub().returns({
        getEntity: sinon.stub().returns({
          getCommits: sinon.stub().returns(["a commit", "another commit"]),
          getLatestCommit: sinon.stub().returns({ foo: "bar" }),
          getUpstream: sinon.stub().returns({
            setCommits: sinon.stub(),
            getLatestCommit: sinon.stub().returns({ foo: "foo" }),
            getRemoteName: sinon.stub().returns("not_origin"),
            getName: sinon.stub().returns("not_origin/master")
          }),
          mention: sinon.stub()
        }),
        hasEntity: sinon.stub().returns(true)
      }),
      getRemoteBranches: sinon.stub().returns({
        hasEntity: sinon.stub().returns(true),
        getEntity: sinon.stub().returns({
          setCommits: sinon.stub(),
          getLatestCommit: sinon.stub().returns({ foo: "foo" }),
          getRemoteName: sinon.stub().returns("origin"),
          getName: sinon.stub().returns("origin/master")
        }),
        createEntity: sinon.spy(function() {
          repo.getRemoteBranches().hasEntity.returns(true)
        })
      }),
      getName: sinon.stub().returns("tada")
    }
    queues = {
      getQueue: sinon.stub().returns({
        push: push
      })
    }
    env.addServiceMock('git.repository.command.queues', queues);
    project = {
      getRepository: sinon.stub().returns(repo)
    }
    env.addServiceMock('git.project', project);
  });

  describe("#_processRepository()", function() {
    it('should push current branch to upstream remote repository, then refresh the model', function() {
      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.be.ok;
      push.calledOnce.should.be.ok;
      push.args[0][1].should.equal("tada");
      push.args[0][2].should.equal("not_origin");
      push.args[0][3].should.equal("master");
      push.args[0][0]();

      project.getRepository.calledWith("tada").should.be.ok;

      repo.getRemoteBranches().createEntity.calledOnce.should.not.be.ok;

      repo.getLocalBranches().getEntity().getCommits.called.should.be.ok;
      repo.getLocalBranches().getEntity().getUpstream().setCommits.args[0][0][0].should.equal("a commit");
      repo.getLocalBranches().getEntity().getUpstream().setCommits.args[0][0][1].should.equal("another commit")

      repo.getLocalBranches().getEntity().getUpstream().setCommits.args[0][0].should.not.equal(repo.getLocalBranches().getEntity().getCommits());

      dialog._renderRepository.calledWith("tada").should.be.ok;
      dialog._renderRepository.args[0][1].message.should.be.ok;
      dialog._renderRepository.args[0][1].repo.should.equal(repo);
    });

    it('should push set the branch if it was in the arguments', function() {
      dialog.arguments.branch = {
        value: "apprentice"
      }
      dialog._processRepository("tada");

      push.args[0][3].should.equal("apprentice");
    });

    it("should mention pushed local branch", function() {
      dialog._processRepository("tada");
      push.args[0][0]();
      repo.getLocalBranches().getEntity().mention.calledOnce.should.be.ok;
    });

    it("should not allow push if there is no point according to the mode", function() {
      repo.getLocalBranches().getEntity().getUpstream().getLatestCommit.returns(repo.getLocalBranches().getEntity().getLatestCommit());

      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.not.be.ok;
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it("should not allow push if it does not have branch named in the arguments", function() {
      repo.getLocalBranches().getEntity.throws();
      repo.getLocalBranches().hasEntity.returns(false);

      dialog._processRepository("tada");

      queues.getQueue.calledWith("tada").should.not.be.ok;
      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
    });

    it("should attempt to push to origin if no there was no upstream", function() {
      repo.getLocalBranches().getEntity().getUpstream.returns(null);

      dialog._processRepository("tada");

      push.args[0][1].should.equal("tada");
      push.args[0][2].should.equal("origin");
      push.args[0][3].should.equal("master");
      push.args[0][0]();

      repo.getRemoteBranches().createEntity.calledOnce.should.not.be.ok;

      repo.getLocalBranches().getEntity().getCommits.called.should.be.ok;
      repo.getRemoteBranches().getEntity.calledWith("origin/master").should.be.ok;
      repo.getRemoteBranches().getEntity().setCommits.args[0][0][0].should.equal("a commit");
      repo.getRemoteBranches().getEntity().setCommits.args[0][0][1].should.equal("another commit")

      repo.getRemoteBranches().getEntity().setCommits.args[0][0].should.not.equal(repo.getLocalBranches().getEntity().getCommits());
    });

    it("should create a new remote branch on origin if there was no upstream, and no branch with the same name on origin", function() {
      repo.getLocalBranches().getEntity().getUpstream.returns(null);
      repo.getRemoteBranches().hasEntity.returns(false);

      dialog._processRepository("tada");

      push.args[0][1].should.equal("tada");
      push.args[0][2].should.equal("origin");
      push.args[0][3].should.equal("master");
      push.args[0][0]();

      repo.getRemoteBranches().createEntity.calledOnce.should.be.ok;
      repo.getRemoteBranches().createEntity.args[0][0].name.should.equal("origin/master")

      repo.getLocalBranches().getEntity().getCommits.called.should.be.ok;
      repo.getRemoteBranches().getEntity.calledWith("origin/master").should.be.ok;
      repo.getRemoteBranches().getEntity().setCommits.args[0][0][0].should.equal("a commit");
      repo.getRemoteBranches().getEntity().setCommits.args[0][0][1].should.equal("another commit")

      repo.getRemoteBranches().getEntity().setCommits.args[0][0].should.not.equal(repo.getLocalBranches().getEntity().getCommits());
    });

   it('should render error if server called back with one', function() {
      dialog._processRepository("tada");
      push.args[0][0]("OMG an error");

      dialog._renderRepository.args[0][1].message.type.should.equal(Tada.Git.Dialog.AbstractDialog.MESSAGE_ERROR);
      (dialog._renderRepository.args[0][1].repo == undefined).should.be.ok;
    });
  });
});
