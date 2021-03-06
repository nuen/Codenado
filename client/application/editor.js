Template.editor.onCreated(function(){
  Meteor.subscribe('editor');
});

Template.editor.onRendered( function() {
  Session.set('isViewingBoard', false);
  Session.set('activeTab', 0);

  setTimeout(clickTab, 1000);
});

Template.editor.events({
  'change .editor-syntax': function(e, tpl){
    var syntaxSelected = $(e.target).val();
    var docId = Session.get('lobbyId') +'-'+ Session.get('activeTab');
    var editor = EditorConfig.findOne({docId: docId});
    if (editor) {
      EditorConfig.update(
        { _id: editor._id },
        {$set: {active_syntax: syntaxSelected}}
      );
    } else {
      EditorConfig.insert({
        docId: docId,
        active_syntax: syntaxSelected
      });
    }
    return false;
  }
});

Template.editor.helpers({
  currentDocId: function () {
    var docId = Session.get('lobbyId') +'-'+ Session.get('activeTab');
    return docId;
  },
  currentTabConfig: function(e){
    var docId = Session.get('lobbyId') +'-'+ Session.get('activeTab');
    var editor = EditorConfig.findOne({docId: docId});
    var syntaxSelected = 'javascript'
    if (editor) {
      syntaxSelected = editor.active_syntax
    }
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      ace.getSession().setUseWrapMode(true);
      ace.session.setMode("ace/mode/"+syntaxSelected);
    }
  },
  isViewingBoard: function() {
    return Session.get("isViewingBoard");
  }
});

function clickTab() {
  $("#tab-link1").click();
}
