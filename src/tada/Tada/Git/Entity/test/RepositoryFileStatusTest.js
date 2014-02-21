require('consoloid-framework/Consoloid/Test/UnitTest');
require('../RepositoryFileStatus');

describeUnitTest('Tada.Git.Entity.RepositoryFileStatus', function() {
  var
    fileStatus;

  describe('getters ans setters', function(){
    beforeEach(function(){
      fileStatus = new Tada.Git.Entity.RepositoryFileStatus({});
    });

    it('should has for staged', function(){
      fileStatus.getStaged().should.be.empty;
      fileStatus.setStaged(['foo']);
      fileStatus.getStaged().should.be.eql(['foo']);
    });

    it('should has for not staged', function(){
      fileStatus.getNotStaged().should.be.empty;
      fileStatus.setNotStaged(['foo']);
      fileStatus.getNotStaged().should.be.eql(['foo']);
    });

    it('should has for untracked', function(){
      fileStatus.getUntracked().should.be.empty;
      fileStatus.setUntracked(['foo']);
      fileStatus.getUntracked().should.be.eql(['foo']);
    });
  });
});
