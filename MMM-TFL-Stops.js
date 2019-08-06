Module.register('MMM-TFL-Stops', {
    defaults: {
        appId: '',
        appKey: '',
        stops: [],
        updateInterval: 60 * 1 * 1000,
        animationSpeed: 2000,
        fade: true,
        fadePoint: 0.25,
        limit: 5,
        timeOffset: 0,
    },

    start() {
        this.loaded = false;
        this.predictions = [];

        this.addFilters();

        this.scheduleUpdate();
        this.updateTimer = null;

        this.updateData();
    },

    updateData() {
        this.sendSocketNotification('GET_STOP_DATA', {
            stops: this.config.stops,
            params: this.getParams(),
        });
    },

    getStyles() {
        return ['MMM-TFL-Stops.css', 'font-awesome.css'];
    },

    getScripts() {
        return ['moment.js'];
    },

    getTemplate() {
        return 'MMM-TFL-Stops.njk';
    },

    getTemplateData() {
        return {
            config: this.config,
            loaded: this.loaded,
            predictions: this.predictions,
        };
    },

    addFilters() {
        this.nunjucksEnvironment().addFilter('formatTime', (timeToStation) => {
            const minutes = moment.duration(timeToStation, 'seconds').minutes();

            if (minutes < 1) {
                return 'Due';
            }

            return `${minutes} mins`;
        });

        this.nunjucksEnvironment().addFilter('getIcon', (modeName) => {
            switch (modeName) {
            case 'tube':
                return 'fa-subway';
            case 'overground':
                return 'fa-train';
            default:
                return 'fa-bus';
            }
        });

        this.nunjucksEnvironment().addFilter('opacity', (currentStep, numSteps) => {
            if (this.config.fade && this.config.fadePoint < 1) {
                if (this.config.fadePoint < 0) {
                    this.config.fadePoint = 0;
                }

                const startingPoint = numSteps * this.config.fadePoint;
                const numFadesteps = numSteps - startingPoint;

                if (currentStep >= startingPoint) {
                    return 1 - (currentStep - startingPoint) / numFadesteps;
                }
            }

            return 1;
        });
    },

    processData(data) {
        let predictions;

        if (typeof data !== 'undefined' && data !== null && data.length !== 0) {
            predictions = data.map(prediction => ({
                stopName: prediction.stationName,
                routeName: prediction.lineName.replace('London ', ''),
                destinationName: prediction.destinationName,
                expectedDeparture: prediction.expectedArrival,
                timeToStation: prediction.timeToStation,
                modeName: prediction.modeName,
                naptanId: prediction.naptanId,
                direction: prediction.direction,
            }));

            // Filter out any unwanted directions
            predictions = predictions.filter((prediction) => {
                const stop = this.config.stops.find(stop => stop.naptanId === prediction.naptanId);

                if (stop.direction && stop.direction !== prediction.direction) {
                    return false;
                }

                return true;
            });

            // If there is an prediction offset exclude predictions before it
            if (this.config.timeOffset) {
                predictions = predictions.filter(prediction => prediction.timeToStation >= this.config.timeOffset);
            }

            // Sort by arrival time
            predictions.sort((a, b) => a.timeToStation - b.timeToStation);

            // Only return results up to the limit
            predictions = predictions.slice(0, this.config.limit);
        }

        this.predictions = predictions;
        this.loaded = true;

        this.updateDom(this.config.animationSpeed);
    },

    getParams() {
        return `?app_id=${this.config.appId}&app_key=${this.config.appKey}`;
    },

    scheduleUpdate() {
        clearTimeout(this.updateTimer);

        this.updateTimer = setTimeout(() => {
            this.updateData();
        }, this.config.updateInterval);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'STOP_DATA') {
            this.processData(payload.data);
            this.scheduleUpdate();
        }
    },
});
