defineClass('Tada.Git.Dialog.Branch.List', 'Consoloid.Ui.List.Dialog.Dialog',
  {
    start: function(args, expression)
    {
      this.__base(args, expression);
      this.__applyFiltersFromArguments();
    },

    __applyFiltersFromArguments: function()
    {
      var filters = [];
      if (this.arguments.repo && this.arguments.repo.value) {
        filters.push('repo: ' + this.arguments.repo.entity.toString());
      }

      if (this.arguments.name && this.arguments.name.value) {
        filters.push('name: ' + this.arguments.name.value);
      }

      if (this.arguments.local && this.arguments.local.value) {
        filters.push('local: ' + true);
      }

      if (this.arguments.remote && this.arguments.remote.value) {
        filters.push('remote: ' + true);
      }

      if (filters.length) {
        this.list.setFilterString(filters.join(' '));
      }
    }
  }
);
