require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require('consoloid-console/Consoloid/Ui/Dialog');
require('../ShowConfig');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Tada.Dialog.ShowConfig', function() {
  var
    tada,
    dialog;

  beforeEach(function() {
    dialog = env.create('Tada.Dialog.ShowConfig', {});

    tada = { getConfig: sinon.stub() };
    env.addServiceMock('tada', tada);
  });

  describe('#setup()', function(){
    it('should stringify the tada config', function(){
      tada.getConfig.returns({ server: { name: 'Test'}});

      dialog.setup();

      dialog.config.should.be.eql('{\n\t"server": {\n\t\t"name": "Test"\n\t}\n}');
    });
  });
});
