var config = {
    'trains': [{
        'trainno': 66,
        'threshold': 20, //number of minutes late to trigger an alert
        'station': 'PVD',
        'sendto': ['email1@address.com', 'email2@address.com'],
        'schedule': '*/20 * * * *' /* every 20 minutes */
    }],

    dataUrl: 'http://dixielandsoftware.net/Amtrak/solari/data/{station}_schedule.php',
    msg: 'TRAIN ALERT: {station} #{trainno} - {time} minutes late.',

    mail: {
        username: 'myGmailAccount@gmail.com',
        password: 'myPassword'
    }

};

module.exports = config;
