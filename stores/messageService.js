import { BehaviorSubject, Subscriber } from 'rxjs'
const subscriber = new BehaviorSubject({ "data": { "message": "" } });
// currentMessage = this.messageSource.asObservable();

const messageService = {
    send: function (msg) {
        subscriber.next(msg);
    }
}

export {
    messageService,
    subscriber
}