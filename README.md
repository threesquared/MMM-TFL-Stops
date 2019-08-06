# MMM-TFL-Stops

This a module for [MagicMirror²](https://github.com/MichMich/MagicMirror).

This module gets arrival predictions for multiple StopPoints using the TfL API and displays them in a single table.

![image](https://user-images.githubusercontent.com/892142/62549496-850b6b00-b860-11e9-8d38-d9fac52f317e.png)

## Installation

```bash
cd modules
git clone https://github.com/threesquared/MMM-TFL-Stops.git
cd MMM-TFL-Stops
npm install
```

## Config

The entry in `config.js` can include the following options:

| Option             | Description                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appId`           | **Required** This is the App ID assigned to you on the TfL Open Data Portal. Details on how to request an App ID can be found [here](https://api.tfl.gov.uk/)<br><br>**Type:** `string`<br>                                                           |
| `appKey`          | **Required** This is the App key assigned to you on the TfL Open Data Portal. Details on how to request an App key can be found [here](https://api.tfl.gov.uk/)<br><br>**Type:** `string`<br>                                                         |
| `stops`            | **Required** An array of StopPoint ids (station naptan code e.g. 940GZZLUAS). You can search for StopPoints IDs [here](http://transport-points.co.uk/index.asp?size=F)<br><br>**Type:** `string`<br>                                                             |
| `timeOffset`       | Optionally only show predictions which arrive in more than provided number of seconds. <br><br>**Type:** `integer`<br> **Default value:** `0`                                                                                                                           |
| `updateInterval`   | How often the arrival information is updated.<br><br>**Type:** `integer`<br>**Default value:** `1 min`                                                                                                                                                |
| `fade`             | Fade the future events to black. (Gradient) <br><br>**Type:** `bool`<br>**Possible values:** `true` or `false` <br> **Default value:** `true`                                                                                                         |
| `fadePoint`        | Where to start fade? <br><br>**Type:** `bool`<br>**Possible values:** `0` (top of the list) - `1` (bottom of list) <br> **Default value:** `0.25`                                                                                                     |
| `animationSpeed`   | Speed of the update animation. (Milliseconds) <br><br>**Type:** `integer`<br>**Possible values:**`0` - `5000` <br> **Default value:** `2000` (2 seconds)                                                                                              |
| `limit`            | Number of departures to return.<br><br>**Type:** `string`<br>**Default:** 5                                                                                                                                                                           |

Here is an example of an entry in `config.js`

```js
{
    module: 'MMM-TFL-Stops',
    position: 'bottom_left',
    header: 'Departures',
    config: {
        appId: "$APPID",
        appKey: "$APPKEY",
        stops: [
            {
                naptanId: "910GBRUCGRV",
                direction: "inbound"
            },
            {
                naptanId: "490013736T"
            },
            {
                naptanId: "490013736Z"
            }
        ],
        timeOffset: 300,
        animationSpeed: 1000,
        fade: true,
        fadePoint: 0.25,
        limit: 5,
    }
},
```

## Acknowledgements

- [Ricardo Gonzalez](https://github.com/ryck) for the [MMM-TFL-Arrivals](https://github.com/ryck/MMM-TFL-Arrivals.git) module which I based this one on.
