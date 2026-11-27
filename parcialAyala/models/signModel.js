import mongoose from "mongoose";
const Schema = mongoose.Schema;

const singSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  characteristics: {
    element: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    ruler: {
      type: String,
      required: true,
    },

    startDay: {
      type: Number,
      required: true,
    },

    startMonth: {
      type: Number,
      required: true,
    },

    endDay: {
      type: Number,
      required: true,
    },

    endMonth: {
      type: Number,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },
  },

  personality: {
    strengths: {
      type: String,
      required: true,
    },

    weaknesses: {
      type: String,
      required: true,
    },

    likes: {
      type: String,
      required: true,
    },

    dislikes: {
      type: String,
      required: true,
    },
  },

  description: {
    type: String,
    required: true,
  },

  man: {
    type: String,
    required: true,
  },

  woman: {
    type: String,
    required: true,
  },
});

const SignModel = mongoose.model("Signs", singSchema);
export default SignModel;
