var axios = require('axios');

var id = "YOUR_CLIENT_ID";
var sec = "YOUR_SECRET_ID";
var param = "?client_id=" + id + "&client_secret=" + sec;

function getUserInfo (username) {
  return axios.get('https://api.github.com/users/' + username + param)
}

function getRepos (username) {
  return axios.get('https://api.github.com/users/' + username + '/repos' + param + '&per_page=100')
  // fetch usernames repos
}

function getTotalStars (repos) {
  return repos.data.reduce(function (prev, current) {
    return prev + current.stargazers_count
  }, 0)
  // calculate all the stars that the user has
}

function getPlayersData (player) {
  return getRepos(player.login)
    .then(getTotalStars)
    .then(function (totalStars){
      return {
        followers: player.followers,
        totalStars: totalStars
      }
    })
  // get Repos
  // get TotalStars
  // return object with that data
}

function calculateScores (players) {
  return [
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ]
  //return an array, after doing algorithm to determine winners
}

var helpers = {
  getPlayersInfo: function (players) {
      return axios.all(players.map(function (username) {
          return getUserInfo(username)
    })).then (function (info){
        return info.map(function (user)
      {
        return user.data;
      })
    }).catch(function (err){
      console.warn('Error in getPlayersInfo', err)
    })
  },
  battle: function (players) {
    var playerOneData = getPlayersData(players[0]);
    var playerTwoData = getPlayersData(players[1]);

    return axios.all([playerOneData, playerTwoData])
      .then(calculateScores)
      .catch(function (err) {console.warn('Error in getPlayersInfo: ',err)})
  }

};

module.exports = helpers;
