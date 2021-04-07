"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
function getSinWave(t) {
    return 3 * Math.abs(Math.sin(((2 * Math.PI) / 10) * t));
}
class InverterSimulator {
    constructor() {
        this.minuteInMilliseconds = 1000 * 60;
        this.dayEnergy = 0;
        this.totalEnergy = 0;
        this.minuteCounter = 0;
        this.generateEnergyEveryMinute();
    }
    getResponse() {
        const response = {
            'DAY_ENERGY': {
                'Value': this.dayEnergy,
                'Unit': "WH"
            },
            'TOTAL_ENERGY': {
                'Value': this.totalEnergy,
                'Unit': "WH"
            }
        };
        this.dayEnergy = 0;
        return response;
    }
    generateEnergyEveryMinute() {
        const self = this;
        setInterval(() => {
            const energyGenerated = getSinWave(self.minuteCounter);
            self.dayEnergy += energyGenerated;
            self.totalEnergy += energyGenerated;
            if (self.minuteCounter < 10) {
                self.minuteCounter += 1;
            }
            else {
                self.minuteCounter = 0;
            }
        }, self.minuteInMilliseconds);
    }
}
const inverterSimulator = new InverterSimulator();
const port = 1337;
http.createServer((req, res) => {
    const reqUrl = url.parse(req.url).pathname;
    if (reqUrl === "/solar_api/v1/GetInverterRealtimeData.cgi") {
        res.writeHead(200, {
            'Content-Type': "application/json"
        });
        const response = inverterSimulator.getResponse();
        res.end(JSON.stringify(response));
    }
    res.writeHead(400, {
        'Content-Type': "application/json"
    });
    res.end();
}).listen(port);
//# sourceMappingURL=server.js.map