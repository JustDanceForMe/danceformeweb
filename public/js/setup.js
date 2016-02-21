/* globals window */
/* globals console */
/* globals Firebase */
/* globals alert */

$(function() {
    'use strict';

    var fbaseRoot = new Firebase('https://justdanceforme.firebaseio.com/');

    fbaseRoot.onAuth(function(authData) {
        if (authData) {
            console.log('Firebase authenticated.');
            $('form').on('submit', function(event) {
                // Grab the username
                var username = $('#username').val();

                // Insert the new profile data
                fbaseRoot.child("users").child(authData.uid).update({
                    username: username,
                }, function(error) {
                    if (error) {
                        alert('An error occurred while joining the game. ' +
                            '(See console for details.)');
                        console.error(error);
                    } else {
                        // Write username to firebase, redirect to /play
                        window.location.href = '/play';
                    }
                });

                event.preventDefault();
            });
        }
    });
});
