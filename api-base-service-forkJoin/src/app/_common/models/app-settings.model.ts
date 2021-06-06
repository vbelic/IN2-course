export class AppSettingsModel {
    constructor (
    ) {
    }

    // TODO: (dm) read settings from local storage and from user settings from server
    // set default formats depending on current/selected locale

    public get dateFormat(): string {
        return "dd.MM.yyyy";
    }

    public get dateTimeFormat(): string {
        return "dd.MM.yyyy HH:mm";
    }
}
