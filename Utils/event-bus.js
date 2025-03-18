class EventBus {
  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }

    this.events = new Map();
    this.wildcardListeners = new Set();
    EventBus.instance = this; // Сохраняем единственный инстанс

    return this;
  }

  // Подписка на событие
  subscribe(event, callback) {
    if (event === '*') {
      // Подписка на все события
      this.wildcardListeners.add(callback);
      return () => this.unsubscribe(event, callback);
    }

    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listeners = this.events.get(event);
    listeners.add(callback);

    return () => this.unsubscribe(event, callback);
  }

  // Отписка от события
  unsubscribe(event, callback) {
    if (event === '*') {
      this.wildcardListeners.delete(callback);
      return;
    }

    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      listeners.delete(callback);

      // Удаляем событие, если подписчиков нет
      if (listeners.size === 0) {
        this.events.delete(event);
      }
    }
  }

  // Публикация события
  publish(event, data) {
    // Вызываем обработчики конкретного события
    if (this.events.has(event)) {
      this.events.get(event).forEach((callback) => callback(data));
    }

    // Вызываем обработчики, подписанные на все события (*)
    this.wildcardListeners.forEach((callback) => callback(event, data));
  }

  // Очистка всех обработчиков для события
  clear(event) {
    if (this.events.has(event)) {
      this.events.delete(event);
    }
  }
}

// Используем window для доступа ко всем микрофронтам
if (!window.EventBus) {
  window.EventBus = new EventBus();
}

export default window.EventBus;
