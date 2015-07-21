PlayersList = new Mongo.Collection('players');


if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function(){
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
        PlayersList.insert({name: playerNameVar,score: 0});
    }
  });
}
