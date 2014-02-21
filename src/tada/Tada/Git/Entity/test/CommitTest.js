require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Entity/Repository');
require('../Author');
require('../Commit');

describeUnitTest('Tada.Git.Entity.Commit', function() {
  var
    commit;

  beforeEach(function(){
    commit = new Tada.Git.Entity.Commit({ hash: '1234'});
  });

  describe('constructor', function(){
    it('should throw when hash is not present', function(){
      (function(){ new Tada.Git.Entity.Commit({ })}).should.throw('hash must be injected');
    });
  });

  describe('getters', function(){
    it('should has for hash', function(){
      commit.getHash().should.be.eql('1234');
    });
  });

  describe('getters and setters', function(){
    it('should has for messageSubject', function(){
      commit.setMessageSubject('commit subject');
      commit.getMessageSubject().should.be.eql('commit subject');
    });

    it('should has for messageBody', function(){
      commit.setMessageBody('message body');
      commit.getMessageBody().should.be.eql('message body');
    });

    it('should has for created date', function(){
      commit.setCreated(new Date('2014-01-20'));
      commit.getCreated().should.be.eql(new Date('2014-01-20'));
    });

    it('should has for author', function(){
      var author = env.mock('Tada.Git.Entity.Author');
      commit.setAuthor(author);
      commit.getAuthor().should.be.eql(author);
    });

    it('should has for branches', function(){
      var branches = env.mock('Consoloid.Entity.Repository');
      commit.setBranches(branches);
      commit.getBranches().should.be.eql(branches);
    });
  });
});
