class EventBus {
  constructor(globalName = 'EventBus') {
    if (window.__eventBusInstances?.[globalName]) {
      return window.__eventBusInstances[globalName];
    }

    this.globalName = globalName;
    this.events = new Map();
    this.wildcardListeners = new Set();

    this.channel = new BroadcastChannel(globalName);
    this.channel.onmessage = (event) => {
      this.publish(event.data.event, event.data.data, false);
    };

    if (!window.__eventBusInstances) {
      window.__eventBusInstances = {};
    }
    window.__eventBusInstances[globalName] = this;
  }

  subscribe(event, callback) {
    if (event === '*') {
      this.wildcardListeners.add(callback);
      return () => this.unsubscribe(event, callback);
    }

    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event).add(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (event === '*') {
      if (callback) {
        this.wildcardListeners.delete(callback);
      } else {
        this.wildcardListeners.clear();
      }
      return;
    }

    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.events.delete(event);
      }
    }
  }

  publish(event, data = {}, broadcast = true) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((callback) => callback(data));
    }

    if (broadcast && data !== undefined) {
      this.channel.postMessage({ event, data: { ...(data || {}), fromBroadcast: true } });
    }

    this.wildcardListeners.forEach((callback) => callback(event, data));
  }

  clear(event) {
    if (event === '*') {
      this.events.clear();
      this.wildcardListeners.clear();
      return;
    }

    this.events.delete(event);
  }

  destroy() {
    this.events.clear();
    this.wildcardListeners.clear();
    this.channel.close();
    delete window.__eventBusInstances[this.globalName];
  }
}

export default EventBus;
