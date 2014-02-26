defineClass('Tada.Configuration.Factory', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        value: {
          server: {
            port: 3500
          }
        }
      }, options));
    },

    createObject: function(values)
    {
      var config = this.create('Consoloid.Base.DeepAssoc', { value: $.extend(true, {}, this.value) });
      config.merge(values);

      return config;
    }
  }
)
