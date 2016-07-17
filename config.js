var config = {
    'trains': [{
        'trainno': 2252, //66,
        'threshold': 20, //number of minutes late to trigger an alert
        'station': 'PVD',
        'sendto': ['byetimmy@gmail.com', 'bob_barber@yahoo.com'],
        'schedule': '*/20 * * * *' /* every 2 minutes */
    }],

    dataUrl: 'http://dixielandsoftware.net/Amtrak/solari/data/{station}_schedule.php',
    msg: 'TRAIN ALERT: {station} #{trainno} - {time} minutes late.',

    mail: {
        username: 'myGmailAccount@gmail.com',
        password: 'myPassword'
    }

};

module.exports = config;
