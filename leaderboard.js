PlayersList = new Mongo.Collection('players');


if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({}, {sort: {score: -1,name: 1}});
    },
    'selectedClass': function () {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (selectedPlayer===playerId){
      return "selected";}
    },
    'showSelectedPlayer': function () {
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    }
  });
}
//leaderboard events start
if(Meteor.isClient){
  Template.leaderboard.events({
    'click .player': function () {
      var playerId = this._id;
      Session.set('selectedPlayer',playerId);
    },
    'click .increment': function(){
       var selectedPlayer = Session.get('selectedPlayer');
       PlayersList.update(selectedPlayer,{$inc: {score: 5}});
    },
    'click .decrement':function () {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer,{$inc: {score: -5}});
    },
    'click .remove':function () {
      var selectedPlayer=Session.get("selectedPlayer");
      var conf = confirm("are you sure ?");
      if (conf) {
      PlayersList.remove(selectedPlayer);
      }
    }
  });
}
//leaderboard events end !

//addplayer events start
if(Meteor.isClient){
  Template.addPlayers.events({
    'submit form': function(event){
        event.preventDefault();
        var playerNameVar = event.target.playerName.value;
        Meteor.call('insertPlayerData',playerNameVar);
    }
  });
}

if(Meteor.isServer){
  Meteor.publish('thePlayers',function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId});
  });
}

if(Meteor.isClient){
  Meteor.subscribe('thePlayers');
}

if(Meteor.isServer){
  Meteor.methods({
    'insertPlayerData':function (playerNameVar) {
      var currentUserId=Meteor.userId();
      PlayersList.insert({name:playerNameVar,score:0,createdBy:currentUserId});
    }
  });
}
