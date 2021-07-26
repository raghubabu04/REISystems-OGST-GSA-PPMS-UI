import { BehaviorSubject } from "rxjs";
const isFormSubmitted = new BehaviorSubject(false);
const validationService = {
  send: function (msg) {
    isFormSubmitted.next(msg);
  },
};

export { validationService, isFormSubmitted };
