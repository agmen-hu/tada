defineClass('Tada.Usage.ExpressionReferenceListener', 'Consoloid.Ui.ExpressionReferenceListener',
  {
    __typeWritingCompleted: function(event, exec)
    {
      this.get("dialogLauncher").setNextInputSource("expression-reference");
      this.__base(event, exec);
    }
  }
);