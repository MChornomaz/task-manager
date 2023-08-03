export class Logger {
  //PATTERN:Observer
  private subscribers: ((message: string) => void)[] = [];
  private errorSubscribers: ((message: string) => void)[] = [];

  public subscribe(subscriber: (message: string) => void) {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: (message: string) => void) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  public subscribeToErrors(subscriber: (message: string) => void) {
    this.errorSubscribers.push(subscriber);
  }

  public unsubscribeFromErrors(subscriber: (message: string) => void) {
    this.errorSubscribers = this.errorSubscribers.filter(
      (sub) => sub !== subscriber
    );
  }

  public log(message: string) {
    this.subscribers.forEach((sub) => sub(message));
  }

  public logError(message: string) {
    this.errorSubscribers.forEach((sub) => sub(message));
  }
}

export class ErrorLogger {
  public logToConsole(message: string) {
    console.log(`Error log: ${message}`);
  }
}
