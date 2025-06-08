import mongoose,{Schema , Document} from "mongoose";

export interface Repos {
        name: string,
        description: string,
        stars: number,
        forks: number,
        language: string ,
        url: string,
}

export interface TopProject  {
        name : string,
        description : string,
        technologies : string[],
        url : string
        }

const RepoSchema :Schema<Repos> = new Schema({
    name : {
        type : String,
        required : [true,"Repo name is required"]
    },
    description : {
        type : String,
    },
    stars : {
        type : Number
    },
    forks : {
        type : Number
    },
    language : {
        type : String,
    },
    url : {
        type : String,
        required : [true,"url is required"]
    }
})

const TopProjectSchema :Schema<TopProject> = new Schema({
     name : {
        type : String,
        required : [true,"Project name is required"]
    },
    description : {
        type : String,
    },
    technologies : {
        type : [String],
    },
     url : {
        type : String,
        required : [true,"url is required"]

    }
})

export  interface User extends Document {
    name: string;
    email: string;
    image?: string;
    provider: string;
    githubUsername?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    skills?: string[];
    repos?: Repos[];
    score: number;
    topProject?: TopProject;
    lastLogin?: Date;

}

const userSchema :Schema<User> = new Schema({
        name : { 
            type : String,
            required : [true,"Username is required"]
        },
        email : { 
            type : String,
            unique : true,
            required  : [true,"Email is required"]
        },
        image : { 
            type : String
        },
        provider : { 
            type : String,
            required : true
        },
        githubUsername : { 
            type : String
        },
        linkedinUrl : { 
            type : String
        },
        resumeUrl : { 
            type : String
        },
        skills : [{ 
            type : String
        }],
        repos : 
            [RepoSchema]
    ,
        score : {
            type : Number,
            default : 0
        },
        topProject : TopProjectSchema,
        lastLogin : {
            type : Date
        }

    } , {timestamps : true} )

export default mongoose.models.User || mongoose.model("User" , userSchema)