class User{
    constructor(Tgid, TelegramUserName, Mod=false, Admin=false){
        this.Tgid = Tgid;
        this.TelegramUserName = TelegramUserName;
        this.Mod = Mod;
        this.Admin = Admin;
    }
};

class App{
    constructor(OwnerID, Name, Description, Version, ApkFile, Icon){
        this.OwnerID = OwnerID; // айди из телеги
        this.Name = Name;
        this.Description = Description;
        this.Version = Version;
        this.ApkFile = ApkFile;
        this.Icon = Icon;
    }
};

class Review{
    constructor(AppName, Username, Text){
        this.AppName = AppName;
        this.Username = Username;
        this.Text = Text;
    }
}

class SupTicket{
    constructor(UserID, Text){
        this.UserID = UserID; //айди из телеги
        this.Text = Text;
    }
};

module.exports = {
    User,
    App,
    SupTicket,
    Review
};