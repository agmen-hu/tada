require('consoloid-framework/Consoloid/Test/UnitTest');
require('../Remote');

describeUnitTest('Tada.Git.Entity.Remote', function() {
  var
    remote;

  beforeEach(function(){
    remote = new Tada.Git.Entity.Remote({name: 'foo'});
  });

  describe('constructor', function(){
    it('should throw when name is not present', function(){
      (function(){ new Tada.Git.Entity.Remote({ })}).should.throw('name must be injected');
    });
  });

  describe('getters', function(){
    it('should has for name', function(){
      remote.getName().should.be.eql('foo');
    });
  });

  describe('getters and setters', function(){
    it('should has for url', function(){
      remote.setUrl('bar');
      remote.getUrl().should.be.eql('bar');
    });
  });
});
