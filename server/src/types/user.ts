export interface IUser {
    personal_info: {
        fullname: string, // Making fullname mandatory
        username: string,
        email: string,
        password: string,
        bio: string,
        profile_img: string,
    },
    social_links: {
        youtube: string,
        instagram: string,
        facebook: string,
        twitter: string,
        github: string,
        website: string
    },
    google_auth: boolean,
    verified: boolean,
    role: string,
    _id: string
}
