/* globals console */
/* globals Firebase */
/* globals window */

$(function() {
    'use strict';
    var fbaseRoot = new Firebase('https://justdanceforme.firebaseio.com/');

    var anonConfig = {
        remember: "sessionOnly",
    };

    fbaseRoot.authAnonymously(function(error, authData) {
        if (error) {
            console.error('An error occurred while authorizing with Firebase');
            console.error(error);
        } else {
            console.log('Firebase authenticated.');
            console.log(authData);
            // var userRef = fbaseRoot.child('users');

            // Check if an authentication code has been generated already
            // TODO: Redirect if so

            // Remove the loading indicator
            $('.number').empty();
            var number = Math.floor(Math.random() * 10000);
            $('.number').text(number);

            // Insert the number into Firebase
            var update = {};
            update[number] = {
                    laptop: authData.uid
            };
            fbaseRoot.child('authCodes').update(update, function() {
                // Attach a handler to when the mobile authenticates
                fbaseRoot.child('authCodes/' + number).on('value', function(snapshot) {
                    // Redirect on connection
                    if(snapshot.val().mobile !== undefined) {
                        // Connected to mobile
                        // Add their UID to the users
                        fbaseRoot.child('users').child(authData.uid).update({
                            mobile: snapshot.val().mobile
                        }, function() {
                            // Remove the auth code
                            fbaseRoot.child('authCodes').child(number).remove(function() {
                                console.log(snapshot.val());
                                window.location.href = '/setup';
                            });
                        });
                    }
                });
            });

        }
    }, anonConfig);
});
