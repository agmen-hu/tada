require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Mentionable');
require('../Branch');
require('../RemoteBranch');

describeUnitTest('Tada.Git.Entity.RemoteBranch', function() {
  var
    branch;

  beforeEach(function(){
    branch = new Tada.Git.Entity.RemoteBranch({ name: 'origin/foo'});
  });

  describe('#getLocalName()', function(){
    it('should return its name without the remote', function(){
      branch.getLocalName().should.be.eql('foo');
    });
  });

  describe('#getRemoteName()', function(){
    it('should return its name without the remote', function(){
      branch.getRemoteName().should.be.eql('origin');
    });
  });
});
