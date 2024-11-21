import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Define interface for User methods
interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  try {
    console.log('Pre-save hook triggered');
    
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping');
      return next();
    }

    console.log('Raw password length:', this.password.length);
    
    // Only hash if password isn't already hashed
    if (this.password.startsWith('$2a$')) {
      console.log('Password already hashed, skipping');
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully. New length:', this.password.length);
    
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

// Define the comparePassword method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);