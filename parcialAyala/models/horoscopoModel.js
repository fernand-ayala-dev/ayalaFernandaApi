import mongoose from "mongoose";

const horoscopeSchema = new mongoose.Schema(
  {
    sign: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expireAfterSeconds: 0
        }
    }
});

// Evita duplicados
horoscopeSchema.index(
  {
    sign: 1,
    type: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

const Horoscopo = mongoose.model("Horoscopo", horoscopeSchema);

export default Horoscopo;
