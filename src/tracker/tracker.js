import { EventEmitter } from "vscode";

export class Tracker {
    constructor() {
        this._onUpdate = new EventEmitter();
        this.onUpdate = this._onUpdate.event;
    }

    start() { throw("Not implemented.") }
}