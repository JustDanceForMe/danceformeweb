/* globals console */
/* globals Firebase */

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

            // Remove the loading indicator
            $('.loadingQrCode').remove();

            // Generate and display a QR Code
            $('#qrCode').qrcode({
                // render method: 'canvas', 'image' or 'div'
                render: 'div',

                // version range somewhere in 1 .. 40
                // minVersion: 1,
                // maxVersion: 40,

                // error correction level: 'L', 'M', 'Q' or 'H'
                ecLevel: 'H',

                // offset in pixel if drawn onto existing canvas
                left: 0,
                top: 0,

                // size in pixel
                size: 400,

                // code color or image element
                fill: '#000',

                // background color or image element, null for transparent background
                background: null,

                // content
                text: JSON.stringify(authData),

                // corner radius relative to module width: 0.0 .. 0.5
                radius: 0,

                // quiet zone in modules
                quiet: 0,

                // modes
                // 0: normal
                // 1: label strip
                // 2: label box
                // 3: image strip
                // 4: image box
                mode: 0,
                //
                // mSize: 0.1,
                // mPosX: 0.5,
                // mPosY: 0.5,
                //
                // label: 'no label',
                // fontname: 'sans',
                // fontcolor: '#000',
                //
                // image: null
            });

            // Attach a handler to when the mobile authenticates

            // Redirect on success

        }
    }, anonConfig);
});
