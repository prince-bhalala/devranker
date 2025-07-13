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

export interface Project {
  name: string;
  description: string;
}

const ProjectSchema = new Schema<Project>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

// Main Document Interface & Schema
export interface Details extends Document {
  name: string;
  email: string;
  skills: string[];
  education: string;
  experience: string;
  projects: Project[];
  achievements?: string[];
}

const resumeDetailsSchema = new Schema<Details>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
    },
    experience: {
      type: String,
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    
  },
  { _id: false }
);

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
    resumedetails : Details;
    linkedinanalysis? : string;

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
        skills : {
            type : [String],
            default : []
        },
        repos : {
            type : [RepoSchema],
            default : []
        },
        score : {
            type : Number,
            default : 0
        },
        topProject : { 
            type : TopProjectSchema
        },
        lastLogin : {
            type : Date
        },
        resumedetails : {
            type :  resumeDetailsSchema,
            required : false,
            default : undefined
        },
        linkedinanalysis : {
          type : String
        }

    } , {timestamps : true} )

export default mongoose.models.User || mongoose.model("User" , userSchema)