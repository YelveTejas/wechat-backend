import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: { type: "String", required: true,unique:true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required:true,
      default:
        "https://images.unsplash.com/profile-1494916794454-f0045e88552d?auto=format&fit=crop&q=60&bg=fff&crop=faces&dpr=1&h=150&w=150",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.matchPassword = async function (Enterpassword){
return await bcrypt.compare(Enterpassword,this.password)
}
userSchema.pre('save', async function(next){     // this funtion is encrypting the password before saveing it 
  if(!this.isModified("password")){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema);
export default User;
