const Store = require('../Redux/Store');
const EventEmitter = require('../EventEmitter');
const { Types, action } = require('../Redux/Actions');

class Rollover {
    constructor(groupId) {
        this.rank = null;
        this.groupId = groupId;
        this.dashboard = null;
        EventEmitter.on(Types.NewDashboard, (prevState, newState, payload) => {
            if (payload.groupId === this.groupId)
                this.loadDashboards();
        });
        EventEmitter.on(Types.NewBroadcast, (prevState, newState, payload) => {
            if (payload.groupId === this.groupId)
                this.loadDashboards()
        });
        EventEmitter.on(Types.UpdateDashboard, (prevState, newState, payload) => {
            if (payload.groupId === this.groupId)
                this.loadDashboards();
        });
        EventEmitter.on(Types.DeleteDashboard, (prevState, newState, payload) => {
            const dashboard = prevState.Data.Dashboards.find((obj) => obj.id === payload);
            if (dashboard && dashboard.groupId === this.groupId)
                this.loadDashboards();
        });
        EventEmitter.on(Types.DeleteBroadcast, (prevState, newState, payload) => {
            const broadcast = prevState.Data.Broadcasts.find(obj => obj.id === payload);
            if (broadcast && broadcast.groupId === this.groupId)
                this.loadDashboards();
        });
        this.loadDashboards();
    }

    getRankMax() {
        let rank = -1;
        for (const dashboard of this.dashboards)
            if (dashboard.rank > rank)
                rank = dashboard.rank;
        return rank;
    }

    loadDashboards() {
        const { Data } = Store.getState();
        this.dashboards = Data.Dashboards.filter((obj) => obj.groupId === this.groupId);
        this.rankMax = this.getRankMax();
        if (!this.rank)
            this.rank = this.rankMax;
        this.nextDashboard();
    }

    getBroadcast() {
        if (this.dashboard && this.dashboard.broadcast)
            return;
        const { Data } = Store.getState();
        const broadcast = Data.Broadcasts.find((obj) => obj.groupId === this.groupId && (!obj.availability || obj.availability.isValid(Date.now())));
        if (broadcast) {
            clearTimeout(this.timeout);
            Store.dispatch(action(Types.DeleteBroadcast, broadcast.id));
        }
        return broadcast;
    }

    getDashboard() {
        if (this.rankMax < 0 || this.dashboard)
            return null;
        let dashboard = null;
        let rank = this.rank;
        while (!dashboard) {
            ++rank;
            if (rank === this.rank)
                return null;
            if (rank > this.rankMax)
                rank = 0;
            dashboard = this.dashboards.find((obj) => obj.rank === rank && (!obj.availability || obj.availability.isValid(Date.now())));
        }
        this.rank = rank;
        return dashboard;
    }

    nextDashboard() {
        let dashboard = this.getBroadcast();
        if (!dashboard)
            dashboard = this.getDashboard();
        if (!dashboard)
            return;
        this.dashboard = dashboard;
        EventEmitter.emit('NextDashboard-' + this.groupId, dashboard);
        if (!dashboard.timeout) {
            this.dashboard = null;
            return;
        }
        this.timeout = setTimeout(() => {
            this.dashboard = null;
            this.nextDashboard();
        }, dashboard.timeout * 1000);
    }

    stop() {
        clearTimeout(this.timeout);
        this.dashboard = null;
    }
};

module.exports = Rollover;
