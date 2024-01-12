/** 
  Observables are declarative. You define a function for publishing values — the source — but that function is not executed until 
  a consumer subscribes to the observable by calling the observable's subscribe method. This subscriber then receives notifications 
  from the observable until it completes, emits an error, or the consumer unsubscribes. An observable can deliver multiple values of 
  any type — literals, messages, or events — depending on the context. A stream of keystrokes, an HTTP response, and the ticks of an 
  interval timer are among the typical observable sources. 
*/

interface _Observable<T> {
  subscribe(...observer: Partial<_Observer<T>>[]): void;
  unsubscribe(observer: Partial<_Observer<T>>, initialUnsubscribe: () => void, ...rest: Array<() => void>): void;
  emit(): void;
}

interface _Observer<T> {
  onEmit(value: T): void;
  onError(error: any): void;
}

const Observable = <T>(state: T, ...observer: Partial<_Observer<T>>[]): _Observable<T> => {
  let observers = [...observer];

  return {
    subscribe(...observer) {
      observers.push(...observer);
    },

    unsubscribe(observer, initialUnsubscribe, ...rest) {
      if (observers.find((o) => o === observer)) {
        let errors: any[] | undefined;

        try {
          initialUnsubscribe();
        } catch (error) {
          errors = [error];
        }

        if (rest) {
          for (const f of rest) {
            try {
              f();
            } catch (error) {
              errors = errors ?? [];
              errors.push(error);
            }
          }
        }

        if (errors) {
          throw new Error(
            `${errors.length} errors occurred during unsubscription:\n${errors
              .map((err, i) => `${i + 1}) ${err.message}`)
              .join("\n")}`
          );
        }
      }
    },
    emit() {
      observers.forEach((observer) => {
        let observe = Observer(observer);
        try {
          observe.onEmit(state);
        } catch (err) {
          observe.onError(err);
        }
      });
    },
  };
};

const Observer = <T>(observerLike: Partial<_Observer<T>>): _Observer<T> => {
  return {
    onEmit(value) {
      console.log("Value:", value);
    },
    onError(error) {
      console.log("Error", error.message);
    },
    ...observerLike,
  };
};
