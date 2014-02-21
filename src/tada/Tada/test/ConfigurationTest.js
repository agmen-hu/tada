require('consoloid-framework/Consoloid/Base/DeepAssoc');
require('../Configuration');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Tada.Configuration', function() {
  describe('#__constructor()', function() {
    it('should require searchFrom option', function() {
      (function() {
        env.create('Tada.Configuration', {});
      }).should.throwError('searchFrom must be injected');
    });

    it('should find .tada/project.conf by searching parent directories', function() {
      var configuration = env.create('Tada.Configuration', { searchFrom: __dirname });

      configuration.getTadaConfigFile().should.equal(__dirname + '/../../../../.tada/project.conf');
    });

    it('should throw error when config file is missing', function() {
      (function() {
        env.create('Tada.Configuration', { searchFrom: '/dev' });
      }).should.throwError('Tada configuration file .tada/project.conf was not found.');
    });

    it('should read configuration from project.conf', function() {
      var configuration = env.create('Tada.Configuration', { searchFrom: __dirname });

      configuration.get('server/name').should.equal('Tada');
    });

    it('should set tadaRoot in config', function() {
      var configuration = env.create('Tada.Configuration', { searchFrom: __dirname });

      configuration.get('tadaRoot').should.equal(__dirname + '/../../../../.tada');
    });
  });
});