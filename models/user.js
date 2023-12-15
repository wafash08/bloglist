import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minLength: 3,
		unique: true,
	},
	name: String,
	passwordHash: String,
});

userSchema.plugin(mongooseUniqueValidator);

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

export const User = mongoose.model('User', userSchema);
