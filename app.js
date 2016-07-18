var schedule = require('node-schedule');
var request = require('request');
var nodemailer = require('nodemailer');

var config = require('./config');

var trains = config.trains;

var _sendMsg = function(trainInfo, station, time, sendto) {

    var transportInfo = 'smtps://{username}:{password}@smtp.gmail.com';
    transportInfo = transportInfo.replace('{username}', encodeURIComponent(config.mail.username));
    transportInfo = transportInfo.replace('{password}', encodeURIComponent(config.mail.password));

    var transporter = nodemailer.createTransport(transportInfo);

    var msg = config.msg;
    msg = msg.replace('{station}', station);
    msg = msg.replace('{trainno}', trainInfo.trainno.trim());
    msg = msg.replace('{time}', time);

    var mailOptions = {
        from: 'Train Alerter <' + config.mail.username + '>',
        to: sendto.join(','),
        subject: msg,
        text: 'Plan accordingly.'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

};


for (var i = 0, trainLen = trains.length; i < trainLen; i++) {
    var train = trains[i];

    train.cronjob = schedule.scheduleJob(train.schedule, (function() {

        var station = this.station.toUpperCase();
        var dataUrl = config.dataUrl.replace('{station}', station);
        var trainno = this.trainno;
        var threshold = this.threshold;
        var sendto = this.sendto;

        request(dataUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    var data = JSON.parse(body).response.results[0].data;

                    for (var j = 0, dataLen = data.length; j < dataLen; j++) {
                        var info = data[j];
                        if (trainno === parseInt(info.trainno.trim(), 10)) {
			    console.log('Checking schedule for train: ' + trainno);
                            var sNewTime = info.newtime24.trim();
                            var sOrigTime = info.scheduled24.trim();
                            if (sNewTime.length > 0) {
                                var origTime = new Date();
                                origTime.setHours(sOrigTime.substring(0, 2));
                                origTime.setMinutes(sOrigTime.substring(2));

                                var newTime = new Date();
                                newTime.setHours(sNewTime.substring(0, 2));
                                newTime.setMinutes(sNewTime.substring(2));

                                var diff = (newTime - origTime) / 60 / 1000;

                                if (diff > threshold) {
                                    _sendMsg(info, station, diff, sendto);

                                }
                            }

                        }
                    }

                } catch (e) {
                    console.log('Unable to parse JSON response.', e);
                }

            }
        });
    }).bind(train));
}
