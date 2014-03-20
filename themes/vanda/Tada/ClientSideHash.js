defineClass('Tada.ClientSideHash', 'Consoloid.Base.Object',
  {
    emailHash: function(email)
    {
      return this.md5(email.replace("<", "").replace(">", "").trim());
    },

    md5: function(text)
    {
      if (this.md5Class === undefined) {
        this.md5Class = {};
        var resourceLoader = this.get('resource_loader');
        (function() {
          eval(resourceLoader.getJs('Tada/md5.min'));
        }.apply(this.md5Class));
      }
      return this.md5Class.md5(text);
    }
  }
);