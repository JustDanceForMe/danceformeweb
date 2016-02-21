/* globals console */
/* globals Firebase */
/* globals setTimeout */
/* globals alert */

$(function() {
    'use strict';

    var fbaseRoot = new Firebase('https://justdanceforme.firebaseio.com/');
    var hasStarted = false;
    var hasAuthenticated = false;

    // fbaseRoot.authAnonymously(function(error, authData) {
    //     if (error) {
    //         console.error('An error occurred while authorizing with Firebase');
    //         console.error(error);
    //     }
    // });

    fbaseRoot.onAuth(function(authData) {
        if (authData && hasAuthenticated === false) {
            console.log('Firebase authenticated.');
            hasAuthenticated = true;
            // Subscribe to the users data, to update the scoreboard
            console.log('Listening to users');
            // debugger; //.orderByChild("results/score")

            fbaseRoot.child('users').on('value', function(snapshot) {
                console.log('sieugs');
                console.log(snapshot.val());
                var index = 1;
                snapshot.forEach(function(user) {
                    console.log(user);
                    var player = $('.player' + index);
                    // player.removeClass('player1 player2 player3 player4').addClass('player' + index);
                    player.find('.name').text(user.name);
                    player.find('.score').text(user.score + ' - ' + user.combo + 'x');
                    index = index + 1;
                });
            });

            // Subscribe to the game_state, to handle updates
            fbaseRoot.child('gameState').on('value', function(snapshot) {
                var gameState = snapshot.val();
                console.log(gameState);
                if (hasStarted === false && gameState.starting === true) {
                    hasStarted = true;

                    // Set up callback to show count-down
                    // TODO

                    console.log('Preparing game start.');

                    // Set up a callback to start the video
                    console.log(new Date().getTime());
                    console.log(new Date(gameState.startTime).getTime());
                    var msUntilGameStart = new Date(gameState.startTime).getTime() - new Date().getTime();
                    console.log(msUntilGameStart);
                    console.log('Starting game in: ' + msUntilGameStart + 'ms.');
                    setTimeout(function() {
                        var video = $('video')[0];
                        video.play();
                        console.log('Starting now!');
                        console.log(video);

                    }, msUntilGameStart);
                }
            });

            // Track buffering progress
            // $('video').on('progress', function() {
            //     var range = 0;
            //     var bf = this.buffered;
            //     var time = this.currentTime;
            //
            //     while(!(bf.start(range) <= time && time <= bf.end(range))) {
            //         range += 1;
            //     }
            //     var loadStartPercentage = bf.start(range) / this.duration;
            //     var loadEndPercentage = bf.end(range) / this.duration;
            //     var loadPercentage = loadEndPercentage - loadStartPercentage;
            //     console.log(loadPercentage);
            // });
        }
    });

});
