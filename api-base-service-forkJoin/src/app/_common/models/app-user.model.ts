export class AppUserModel {
    constructor (
        private _userName: string,
        private _firstName: string,
        private _lastName: string,
        private _displayName: string
    ) {
    }

    // DO NOT INCLUDE USER ID IN THE CLIENT CODE!!!

    public get userName(): string {
        return this._userName;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public get displayName(): string {
        return this._displayName;
    }
}
