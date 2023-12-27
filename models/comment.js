import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	comment: {
		type: String,
	},
	blog: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog',
	},
});

commentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export const Comment = mongoose.model('Comment', commentSchema);
