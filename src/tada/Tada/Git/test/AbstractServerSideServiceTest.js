require('consoloid-server/Consoloid/Server/Service');
require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-framework/Consoloid/Error/UserMessage');

require('../AbstractServerSideService');

describeUnitTest('Tada.Git.AbstractServerSideService', function() {
  var
    service,
    tadaConfig,
    git;

  beforeEach(function(){
    git = sinon.stub();
    tadaConfig = {
      get: sinon.stub()
    };
    env.addServiceMock('tada_config', tadaConfig);

    service = env.create('Tada.Git.AbstractServerSideService', { git: git });
  });

  describe('#getRepository(name)', function(){
    it('should throw a user message if the requsited repo does not exist', function(){
      tadaConfig.get.returns({'foo':'alma', 'bar':'alma'});

      (function(){ service.getRepository('alma'); }).should.throw(/Repository not found.+/)
    });

    it('should throw an error if the repository is not a git repository', function(){
      tadaConfig.get.returns({'foo':'alma', 'bar':'alma'});
      git.returns({ isRepository: false });

      (function(){ service.getRepository('foo'); }).should.throw(/This is not a git repository.+/)
    });

    it('should return the gitty repository object', function(){
      tadaConfig.get.returns({'foo':'alma', 'bar':'alma'});
      git.returns({ isRepository: true });

      service.getRepository('foo').isRepository.should.be.true;
    })
  });
});
