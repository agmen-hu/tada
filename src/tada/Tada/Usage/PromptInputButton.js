defineClass('Tada.Usage.PromptInputButton', 'Consoloid.Speech.PromptInputButton',
  {
    handleRecognitionCompleted: function(event)
    {
      this.get("dialogLauncher").setNextInputSource("mic");
      this.__base(event);
    }
  }
);