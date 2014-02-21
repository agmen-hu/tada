defineClass('Tada.Dialog.ShowConfig', 'Consoloid.Ui.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: 'Tada-Dialog-ShowConfig',
      }, options));
    },

    setup: function()
    {
      var config = this.container.get('tada').getConfig('/');
      this.config = JSON.stringify(config, undefined, '\t');
    }
  }
);
