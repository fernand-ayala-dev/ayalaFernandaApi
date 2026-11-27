import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mySchema = new Schema({

  sign1: {
    type: Schema.Types.ObjectId,
    ref: "Signs",
    required: true
  },

  sign2: {
    type: Schema.Types.ObjectId,
    ref: "Signs",
    required: true
  },

  sex: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  confidentiality: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  communication: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  emotions: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  convictions: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  activity: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  },

  summary: {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true
    }
  }

});

const CompatibilityModel = mongoose.model(
  "Compatibility",
  mySchema
);

export default CompatibilityModel;