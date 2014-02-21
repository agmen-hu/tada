require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');

require('../../AbstractServerSideService');
require('../Diff');

describeUnitTest('Tada.Git.Command.Diff', function() {
  var
    diff,
    repo,
    git,
    command,
    stdOut,
    callback;

  beforeEach(function() {
    repo = { foo: "bar" };
    command = {
        exec: sinon.stub()
      }
    git = {
      Command: sinon.stub().returns(command),
    }
    callback = sinon.stub();

    diff = env.create('Tada.Git.Command.Diff', { git: git });
    diff.__getResultCallback = sinon.stub().returns(callback);
    diff.getRepository = sinon.stub().returns({
      path: "path/to/tada"
    });

    stdOut =
      "diff -git a/something b/something\n" +
      "index 12...34 56\n" +
      "--- something\n" +
      "+++ something\n" +
      "@@ 1,2\n" +
      " ab\n" +
      "-cd\n" +
      "+de\n" +
      " gh\n";
  });
  describe("#getDiff(callback, data)", function() {
    it("should run diff command on gitty", function() {
      diff.getDiff({}, { repo: "tada" });

      diff.getRepository.calledOnce.should.be.ok;
      diff.getRepository.args[0][0].should.equal("tada");

      git.Command.calledOnce.should.be.ok;
      git.Command.args[0][0].should.equal("path/to/tada");
      git.Command.args[0][1].should.equal("diff");
      git.Command.args[0][3].should.equal("");

      command.exec.calledOnce.should.be.ok;
      command.exec.args[0][0](undefined, stdOut);

      callback.calledOnce.should.be.ok;
    });

    it("should return with the diff", function() {
      diff.getDiff({}, { repo: "tada" });
      command.exec.args[0][0](undefined, stdOut);

      var responseLines = JSON.parse(callback.args[0][1].diffLines);
      responseLines[0].should.equal("diff -git a/something b/something");
      responseLines[1].should.equal("index 12...34 56");
      responseLines[2].should.equal("@@ 1,2");
      responseLines[3].should.equal(" ab");
      responseLines[4].should.equal("-cd");
      responseLines[5].should.equal("+de");
      responseLines[6].should.equal(" gh");
    });

    it("should return with the diff for a file, if it was passed as an argument", function() {
      diff.getDiff({}, { repo: "tada", file: "some_path/some_deeper_path/some_file" });

      git.Command.args[0][3].should.equal("some_path/some_deeper_path/some_file");
    });

    it("should throw if no repo was set", function() {
      (function() {
        diff.getDiff();
      }).should.throwError();
    });
  });
});