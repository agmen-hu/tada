require('consoloid-framework/Consoloid/Test/UnitTest');
require('../RefList');

describeUnitTest('Tada.Git.Command.OutputParser.RefList', function() {
  var
    parser,
    localRefList,
    remoteRefList;

  beforeEach(function(){
    parser = new Tada.Git.Command.OutputParser.RefList();
    localRefList =
      "'f00' 'stash' '' '2014-01-01' 'Foo Bar' '<foo@bar>' 'WIP on master: bla-bla' '' \n\
      'ba4' 'master' 'origin/master' '2014-01-02' 'Bar Foo' '<bar@foo>' 'This is a really important commit. (refs #123)' '' \n\
      'f00ba4' 'some_branch' 'origin/some_branch' '2014-01-03' 'Bar Foo' '<bar@foo>' 'This is some commit on some branch' ''\n";
    remoteRefList =
      "'ba4' 'origin/HEAD' '' '2014-01-02' 'Bar Foo' '<bar@foo>' 'This is a really important commit. (refs #123)' '' \n\
      'ba4' 'origin/master' '' '2014-01-02' 'Bar Foo' '<bar@foo>' 'This is a really important commit. (refs #123)' '' \n\
      'ba4f00' 'origin/some_branch' '' '2014-01-04' 'Foo Bar' '<foo@bar>' 'This is another commit reverting the previous one' 'Because Bar Foo\\'s an idiot\n" +
      "\n" +
      "but he deserves multiple lines of text\'\n";
  });

  describe("#parse(localRefList, remoteRefList)", function() {
    var
      data;

    beforeEach(function() {
      data = parser.parse(localRefList, remoteRefList);
    });

    it("should parse local and remote ref list and return with non duplicate plain objects", function() {
      data.commits.length.should.equal(4);

      data.commits[0].hash.should.equal('f00');
      data.commits[0].created.should.eql('2014-01-01');
      data.commits[0].author.should.equal('<foo@bar>');
      data.commits[0].messageSubject.should.equal('WIP on master: bla-bla');
      data.commits[0].messageBody.should.equal('');

      data.commits[1].hash.should.equal('ba4');
      data.commits[1].created.should.eql('2014-01-02');
      data.commits[1].author.should.equal('<bar@foo>');
      data.commits[1].messageSubject.should.equal('This is a really important commit. (refs #123)');
      data.commits[1].messageBody.should.equal('');

      data.commits[2].hash.should.equal('f00ba4');
      data.commits[2].created.should.eql('2014-01-03');
      data.commits[2].author.should.equal('<bar@foo>');
      data.commits[2].messageSubject.should.equal('This is some commit on some branch');
      data.commits[2].messageBody.should.equal('');

      data.commits[3].hash.should.equal('ba4f00');
      data.commits[3].created.should.eql('2014-01-04');
      data.commits[3].author.should.equal('<foo@bar>');
      data.commits[3].messageSubject.should.equal('This is another commit reverting the previous one');
      data.commits[3].messageBody.should.equal('Because Bar Foo\'s an idiot\n\nbut he deserves multiple lines of text');

      data.branches.length.should.equal(3);

      data.branches[0].name.should.equal('stash');
      data.branches[0].lastCommit.should.equal('f00');

      data.branches[1].name.should.equal('master');
      data.branches[1].lastCommit.should.equal('ba4');

      data.branches[2].name.should.equal('some_branch');
      data.branches[2].lastCommit.should.equal('f00ba4');

      data.remoteBranches.length.should.equal(2);

      data.remoteBranches[0].name.should.equal('origin/master');
      data.remoteBranches[0].lastCommit.should.equal('ba4');

      data.remoteBranches[1].name.should.equal('origin/some_branch');
      data.remoteBranches[1].lastCommit.should.equal('ba4f00');

      data.authors.length.should.equal(2);

      data.authors[0].name.should.equal('Foo Bar');
      data.authors[0].email.should.equal('<foo@bar>');

      data.authors[1].name.should.equal('Bar Foo');
      data.authors[1].email.should.equal('<bar@foo>');
    });

    it('should remove author id, which is used internally in this class', function() {
      (data.authors[0].id == undefined).should.be.ok;
      (data.authors[1].id == undefined).should.be.ok;
    })
  });
});
