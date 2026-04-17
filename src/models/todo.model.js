import mongoose from "mongoose";

/**
 * TODO: Define Todo schema
 *
 * Fields:
 * - title: String, required, trim, min 3, max 120 chars
 * - completed: Boolean, default false
 * - priority: Enum ["low", "medium", "high"], default "medium"
 * - tags: Array of Strings, max 10 items, default []
 * - dueDate: Date, optional
 *
 * Options:
 * - Enable timestamps
 * - Add index: { completed: 1, createdAt: -1 }
 */


const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (val) {
          return val.length <= 10;
        },
        message: "Tags cannot exceed 10 items"
      }
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// TODO: Add index
todoSchema.index({ completed: 1, createdAt: -1 });

// TODO: Create and export the Todo model
export const Todo = mongoose.model("Todo", todoSchema);