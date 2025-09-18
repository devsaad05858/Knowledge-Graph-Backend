import mongoose, { Document, Schema } from 'mongoose';

export interface INode extends Document {
  _id: mongoose.Types.ObjectId;
  label: string;
  type: string;
  properties: Record<string, any>;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const NodeSchema = new Schema<INode>({
  label: {
    type: String,
    required: true,
    trim: true,
    index: 'text' // Enable text search on labels
  },
  type: {
    type: String,
    required: true,
    default: 'default',
    index: true
  },
  properties: {
    type: Schema.Types.Mixed,
    default: {}
  },
  x: {
    type: Number,
    required: true,
    default: 0
  },
  y: {
    type: Number,
    required: true,
    default: 0
  },
  fx: {
    type: Number,
    default: null
  },
  fy: {
    type: Number,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      return ret;
    }
  }
});

// Create text index for search functionality
NodeSchema.index({ label: 'text', type: 'text' });

export const NodeModel = mongoose.model<INode>('Node', NodeSchema); 