const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({
    getStopData({ stops, params }) {
        const promises = stops.map(stop => this.getUrl(encodeURI(`https://api.tfl.gov.uk/StopPoint/${stop.naptanId}/arrivals${params}`)));

        Promise.all(promises).then((data) => {
            this.sendSocketNotification('STOP_DATA', {
                data: [].concat(...data),
            });
        });
    },

    getUrl(url) {
        return new Promise((resolve, reject) => {
            request({ url, method: 'GET' }, (error, response, body) => {
                if (!error && response.statusCode === 200 && body != null) {
                    resolve(JSON.parse(body));
                } else {
                    reject();
                }
            });
        });
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'GET_STOP_DATA') {
            this.getStopData(payload);
        }
    },
});
