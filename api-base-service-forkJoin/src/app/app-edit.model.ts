export class AppEditModel {
    private _isDirty = false;
    private _isValid = true;

    public get isDirty() {
        return this._isDirty;
    }

    public set isDirty(value: boolean) {
        this._isDirty = value;
    }

    public get isValid() {
        return this._isValid;
    }

    public set isValid(value: boolean) {
        this._isValid = value;
    }

    public get isReadOnly() {
        return false;
    }

    constructor() {
        this.clear();
    }

    public clear(): void {
        this._isDirty = false;
        this._isValid = true;
    }

    public validate(): boolean {
        if (this._isValid) {

        }

        return this._isValid;
    }
}
