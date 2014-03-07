defineClass('Tada.Application', 'Consoloid.Base.Object',
  {
     __constructor: function(options)
    {
      this.__base($.extend({
        css: 'tada'
      }, options));

      this.get('css_loader').load(this.css);

      this.loadConfig();
    },

    loadConfig: function()
    {
      this.config = this.create('Consoloid.Base.DeepAssoc', { value: this.get('tada.config.getter').getConfig('/') });
    },

    getConfig: function(path, defaultValue)
    {
      return this.config.get(path, defaultValue);
    }
  }
);