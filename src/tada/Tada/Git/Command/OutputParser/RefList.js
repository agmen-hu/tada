defineClass('Tada.Git.Command.OutputParser.RefList', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        data: {
          commits: [],
          branches: [],
          remoteBranches: [],
          authors: []
        }
      }, options));
    },

    parse: function(localRefList, remoteRefList)
    {
      this.__parseRefList(localRefList, this.data.branches);
      this.__parseRefList(remoteRefList, this.data.remoteBranches);
      return this.data;
    },

    __parseRefList: function(refList, branchArray)
    {
      var refArray = this.__refListToArray(refList);
      refArray.forEach((function(line) {
        this.__addCommit(line);
        this.__addBranch(line, branchArray);
        this.__addAuthor(line);
      }).bind(this));
    },

    __refListToArray: function(refList)
    {
      var refArray = [];
      var lastLineArray = [];
      var lastWord = "";
      var inWord = false;
      var lastCharacterWasEscapeCharacter = false;

      for (i = 0; i < refList.length; i++) {
        if (lastCharacterWasEscapeCharacter) {
          lastWord += refList[i];
          lastCharacterWasEscapeCharacter = false;
        } else {
          switch (refList[i]) {
            case "\\":
              if (inWord && !lastCharacterWasEscapeCharacter) {
                lastCharacterWasEscapeCharacter = true;
              }
              break;
            case "'":
              if (inWord) {
                lastLineArray.push(lastWord);
                lastWord = "";
              }
              inWord = !inWord;
              break;
            case "\n":
              if (!inWord) {
                refArray.push(lastLineArray);
                lastLineArray = [];
                break;
              }
            default:
              if (inWord) {
                lastWord += refList[i];
              }
          }
        }
      };

      return refArray;
    },

    __addCommit: function(line)
    {
      if (this.__alreadyInArray(this.data.commits, line[0], 'hash')) {
        return;
      }

      this.data.commits.push({
        hash: line[0],
        created: line[3],
        author: line[5],
        messageSubject: line[6],
        messageBody: line[7]
      });
    },

    __alreadyInArray: function(array, id, idProperty)
    {
      return array.some(function(element) {
        return element[idProperty] == id;
      });
    },

    __addBranch: function(line, branchArray)
    {
      if (this.__alreadyInArray(branchArray, line[1], 'name') || line[1].indexOf("/HEAD") != -1) {
        return;
      }

      branchArray.push({
        name: line[1],
        upstream: line[2],
        lastCommit: line[0]
      });
    },

    __addAuthor: function(line)
    {
      if (this.__alreadyInArray(this.data.authors, line[5], 'email')) {
        return;
      }

      this.data.authors.push({
        name: line[4],
        email: line[5]
      });
    }
  }
);
