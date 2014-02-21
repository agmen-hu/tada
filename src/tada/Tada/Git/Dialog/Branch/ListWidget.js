defineClass('Tada.Git.Dialog.Branch.ListWidget', 'Consoloid.Ui.List.Widget',
  {
    __addEventListeners: function()
    {
      this.__base();

      this.eventDispatcher.on('collapsed-item-opened', this.addInspectedBranchToContext.bind(this));
    },

    addInspectedBranchToContext: function(event, node)
    {
      node = $(node);
      var cls = node.data('isRemote') ? 'Tada.Git.Context.RemoteBranch' : 'Tada.Git.Context.LocalBranch';
      this.container.get('context').mention(cls, node.data('branch'));
    },

    __clearFiltersEvent: function()
    {
      this.dataSource.buildData();
      this.__base();
    }
  }
);
