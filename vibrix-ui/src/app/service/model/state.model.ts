import { HttpErrorResponse } from "@angular/common/http";
import { User } from "./user.model";

export type Status = 'OK' | 'ERROR' | 'INIT';

export const NOT_CONNECTED = 'NOT_CONNECTED';

export class State<V, E> {
    value?: V;
    error?: E;
    status: Status;

    constructor(status: Status, value?: V, error?: E) {
        this.value = value;
        this.error = error;
        this.status = status;
    }

    static build<V, E>() {
        return new StateBuilder<V, E>();
    }

    static unauthorized(): State<User, HttpErrorResponse> {
        return State.build<User, HttpErrorResponse>().ok({ email: NOT_CONNECTED }).build();
    }

    static ok<V, E = HttpErrorResponse>(value: V): State<V, E> {
        return State.build<V, E>().ok(value).build();
    }

    static failed<V, E = HttpErrorResponse>(error: E): State<V, E> {
        return State.build<V, E>().failed(error).build();
    }

    static init<V, E = HttpErrorResponse>() {
        return State.build<V, E>().init().build();
    }

}

class StateBuilder<V, E> {
    private status: Status = 'INIT';
    private value?: V;
    private error?: E;

    failed(error: any): StateBuilder<V, E> {
        this.error = error;
        this.status = "ERROR";
        return this;
    }

    ok(value: V): StateBuilder<V, E> {
        this.value = value;
        this.status = "OK";
        return this;
      }

    init(): StateBuilder<V, E> {
        this.status = "INIT";
        return this;
    }

    build(): State<V, E> {
        return new State<V, E>(this.status, this.value, this.error);
    }
}