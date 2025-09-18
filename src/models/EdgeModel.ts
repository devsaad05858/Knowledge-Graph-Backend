import mongoose, { Document, Schema } from 'mongoose';

export interface IEdge extends Document {
  _id: mongoose.Types.ObjectId;
  source: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  label: string;
  properties: Record<string, any>;
  directed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EdgeSchema = new Schema<IEdge>({
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    required: true,
    index: true
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    required: true,
    index: true
  },
  label: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  properties: {
    type: Schema.Types.Mixed,
    default: {}
  },
  directed: {
    type: Boolean,
    default: true
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

// Compound index for efficient edge queries
EdgeSchema.index({ source: 1, target: 1 });
EdgeSchema.index({ target: 1, source: 1 });

export const EdgeModel = mongoose.model<IEdge>('Edge', EdgeSchema); 