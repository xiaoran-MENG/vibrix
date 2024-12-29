import { HttpErrorResponse } from "@angular/common/http";
import { User } from "./user.model";

export type Status = 'OK' | 'ERROR' | 'INIT';

export const NOT_CONNECTED = 'NOT_CONNECTED';

export class State<V, E> {
    value?: V;
    error?: E;
    status: Status;

    private constructor(status: Status, value?: V, error?: E) {
        this.value = value;
        this.error = error;
        this.status = status;
    }

    static unauthorized(): State<User, HttpErrorResponse> {
        return new State<User, HttpErrorResponse>('OK', { email: NOT_CONNECTED });
    }

    static ok<V, E = HttpErrorResponse>(value: V): State<V, E> {
        return new State<V, E>('OK', value);
    }

    static failed<V, E = HttpErrorResponse>(error: E): State<V, E> {
        return new State<V, E>('ERROR', undefined, error);
    }

    static init<V, E = HttpErrorResponse>(): State<V, E> {
        return new State<V, E>('INIT');
    }
}
