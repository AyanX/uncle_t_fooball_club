
    // address: varchar("address", { length: 255 }).notNull(),
    // phone_number: varchar("phone_number", { length: 255 }).notNull(),
    // email: varchar("email", { length: 255 }).notNull(),
    // open_hours: varchar("open_hours", { length: 255 }).notNull(),
    // close_hours: varchar("close_hours", { length: 255 }).notNull(),
    // open_day: varchar("open_day", { length: 255 }).notNull(),
    // close_day: varchar("close_day", { length: 255 }).notNull(),
    // location: varchar("location", { length: 255 }).notNull(),

const validSocial = social => {
    const { address, phone_number, email, open_hours, close_hours, open_day, close_day, location } = social;
    if (!address || !phone_number || !email || !open_hours || !close_hours || !open_day || !close_day || !location) {
        return false;
    }
    return true;
}

const validSocialToClient = social =>{
    return {
        address: social.address,
        phone_number: social.phone_number,
        email: social.email,
        open_hours: social.open_hours,
        close_hours: social.close_hours,
        open_day: social.open_day,
        close_day: social.close_day,
        location: social.location,
        twitter: social.twitter,
        facebook: social.facebook,
        youtube: social.youtube,
        instagram: social.instagram
    }
}

module.exports = {
    validSocial,
    validSocialToClient
}