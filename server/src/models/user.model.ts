import mongoose from "mongoose";

const { Schema } = mongoose;

const profileImgsNameList = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
const profileImgsCollectionsList = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = new Schema({
    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: false,
            // minlength: [3, 'fullname must be 3 letters long'],
        },
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
            required:true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: String,
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profileImgsCollectionsList[Math.floor(Math.random() * profileImgsCollectionsList.length)]}/svg?seed=${profileImgsNameList[Math.floor(Math.random() * profileImgsNameList.length)]}`
            }
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum:['user', 'admin'],
        default: 'user'
    },
},
{
    timestamps: {
        createdAt: 'joinedAt'
    }
});


const User = mongoose.model('User', userSchema);
export default User;