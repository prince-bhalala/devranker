import mongoose, { Schema, Document } from "mongoose";

// Subdocument Interface & Schema
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
  { timestamps: true }
);

export default mongoose.models.ResumeDetail || mongoose.model<Details>("ResumeDetail", resumeDetailsSchema);
    