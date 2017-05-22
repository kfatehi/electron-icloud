const EventEmitter = require('events').EventEmitter;

class FMF extends EventEmitter {
  constructor() {
    super();
    this.state = {
      friends: {}
    };
  }

  updateFriends(list) {
    list.forEach((f)=>{
      this.state.friends[f.id] = { 
        id: f.id,
        email: f.invitationAcceptedByEmail,
        handles: f.invitationAcceptedHandles
      }
    });
  }

  updateLocations(locations=[]) {
    locations.forEach((loc)=>{
      const f = this.state.friends[loc.id];
      f.location = loc.location;
    });
  }

  getCaptureCriteria() {
    return [{
      id: 'Init', pathname: { endsWith: 'initClient' }
    },{
      id: 'Refresh', pathname: { endsWith: 'refreshClient' }
    }]
  }

  routeCapture(id, data) {
    this['handle'+id](data);
  }

  handleInit(data) {
    const resp = JSON.parse(data.response);
    this.updateFriends(resp.following);
    this.updateLocations(resp.locations);
  }

  handleRefresh(data) {
    const resp = JSON.parse(data.response);
    this.updateLocations(resp.locations);
  }
};

module.exports = FMF
