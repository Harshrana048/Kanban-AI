const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
   password: {
        type: String,
        required: [function() {return !this.googleId;}, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    avatar: {
      type: String,
      default: function () {
        // Auto-generate avatar URL from name initials
        const initials = this.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff`;
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,                 
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });       

userSchema.pre('save',async function(){
    if(!this.isModified('password') || !this.password) return ;
    this.password = await bcrypt.hash(this.password,10);  
});


// Compare entered password with hashed password in DB
userSchema.methods.comparePassword = function(candiate){
    if(!this.password) return Promise.resolve(false);
    return bcrypt.compare(candiate,this.password);
}

module.exports = mongoose.model('User', userSchema);
