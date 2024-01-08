interface observable {
  subscribe(observer: observer): void;
  unsubscribe(observer: observer): void;
  notify(): void;
}

interface observer {
  update(observable: observable): void;
}

class concreteObservable implements observable {
  private state: number = 0;
  private observers: observer[];

  constructor(observers: observer[]) {
    this.observers = observers;
  }

  subscribe(observer: observer): void {
    const doesExist = this.observers.find((o) => o === observer);

    if (doesExist) {
      console.log("Observer Exists");
    } else {
      this.observers.push(observer);
      console.log("Added Observer");
    }
  }

  unsubscribe(observer: observer): void {
    const doesExist = this.observers.find((o) => o === observer);

    if (doesExist) {
      this.observers = this.observers.filter((o) => o !== observer);
      console.log("Removed Observer");
    } else {
      console.log("Observer Doesn't Exist");
    }
  }

  notify(): void {
    console.log("Notifying Observers:");
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  updateState(): void {
    ++this.state;
    this.notify();
  }

  getState(): number {
    return this.state;
  }
}

class concreteObserver implements observer {
  update(observable: concreteObservable): void {
    console.log("Observer reacting to state change to:", observable.getState());
  }
}

const observable = new concreteObservable([] as observer[]);
const observer_1 = new concreteObserver();
const observer_2 = new concreteObserver();

observable.subscribe(observer_1);
observable.subscribe(observer_2);

observable.updateState();

observable.unsubscribe(observer_1);

observable.updateState();

observable.unsubscribe(observer_1);
observable.unsubscribe(observer_2);
