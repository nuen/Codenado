Template.users.events({

  'click li .viewers-dropdown': function (e) {
    e.preventDefault();
    $(e.target).closest('.viewers.dropdown-select-list').addClass('dropdown-is-open');
  },

  'blur .viewers .dropdown-top-item': function(){
    $('.viewers.dropdown-select-list.dropdown-is-open').removeClass('dropdown-is-open');
  }

});

Deps.autorun(function(){
  if (Meteor.user()) {
    Meteor.subscribe('allUsers');
    Meteor.subscribe('userStatus');
  }

  // console.log(Meteor.users.count);

  // if (Meteor.users.count == 1) {
  //   console.log("HERE!!");
  //   setUserRoles(Meteor.user(), "presenter");
  // }

  var usersOnline = Meteor.users.find({ "status.online": true });

  Template.users.helpers({
    users: function () {
      var userArray = [];
      usersOnline.forEach( function(user) {
        userArray.push({
          url: user.profile.avatar_url,
          name: user.profile.name
        });
      });
      return userArray;
    },
    updateRoles: function (targetUserId, roles, group) {
      var loggedInUser = Meteor.user();

      if (!loggedInUser ||
          !Roles.userIsInRole(loggedInUser, 
                              ['manage-users','support-staff'], group)) {
        throw new Meteor.Error(403, "Access denied")
      }
      Roles.setUserRoles(targetUserId, roles, group)
    },
    userCount: function () {
      return Meteor.users.find().count();
    }
  });



});
