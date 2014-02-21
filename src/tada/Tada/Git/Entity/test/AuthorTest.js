require('consoloid-framework/Consoloid/Test/UnitTest');
require('../Author');

describeUnitTest('Tada.Git.Entity.Author', function() {
  var
    author;

  beforeEach(function(){
    author = new Tada.Git.Entity.Author();
  });

  describe('getters and setters', function(){
    it('should has for name', function(){
      author.setName('foo');
      author.getName().should.be.eql('foo');
    });

    it('should has for email', function(){
      author.setEmail('bar');
      author.getEmail().should.be.eql('bar');
    });
  });
});
