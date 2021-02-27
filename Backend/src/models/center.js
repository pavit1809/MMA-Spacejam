const validator=require('validator');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const path=require('path');

require('dotenv').config({path:path.resolve(__dirname, '../../.env') });

const centerSchema=mongoose.Schema({
      Name:{
            type:String,
            required:true,
            trim:true
      },
      Address:{
            type:String,
            required:true,
            trim:true
      },
      PhoneNo:{
            type:String,
            required:true,
            trim:true
      },
      Email:{
            type:String,
            required:true,
            unique:true,
            trim: true,
            lowercase: true,
            validate(value){
                  if (!validator.isEmail(value)){
                        throw new Error('Email is invalid');
                  }
            }
      },
      Password:{
            type:String,
            required:true,
            minlength:8
      },
      OpeningTime:{
            type:String,
            required:true,
      },
      ClosingTime:{
            type:String,
            required:true
      },
      RecentMobileOtps:[Number],
      RecentEmailOtps:[Number],
      Status:{
            type:Boolean //true means activated ;;false means not activated
      },
      NearestLandmark:{
            type:String,
            required:true
      },
      City:{
            type:String,
            required:true
      },
      Pincode:{
            type:String,
            required:true
      },
      State:{
            type:String,
            required:true
      },
      Country:{
            type:String,
            required:true
      },
      FrontImage:{
            type:String,
            required:true
      },
      FrontImageType:{
            type:String,
      },
      LicenseNum:{
            type:String,
            required:true
      },
      PositionCoordinates:[Number],
      Reviews:[{
            text:{type:String},
            stars:{type:Number,default:5}
      }],
      tokens:[{
            token:{
                  type:String,
                  required:true
            }
      }],
      AvgStars:{
            type:Number,
            default:5,
      },
      Alloptions:[String]
})

centerSchema.methods.toJSON=function(){
      const center=this;
      const cenobj=center.toObject();

      delete cenobj.Password
      delete cenobj.tokens;
      delete cenobj.RecentMobileOtps;
      delete cenobj.RecentEmailOtps;
      return cenobj;
}

centerSchema.methods.generateauthtoken=async function(){
      const center=this;
      const token=jwt.sign({_id:center._id.toString()},process.env.AUTHSRT);
      center.tokens=center.tokens.concat({token: token});
      await center.save();
      return token;
}

centerSchema.statics.findbycredentials=async (email,password)=>{
      const center=await Center.findOne({Email:email});
      if (!center)
      {
            throw new Error("Unable to login");
      }
      const isMatch=await bcrypt.compare(password,center.Password);
      if (!isMatch)
      {
            throw new Error('Unable to login');
      }
      return center;
}


centerSchema.pre('save',async function(next){
      if (this.isModified('Password')){
            const hash=await bcrypt.hash(this.Password,8);
            this.Password=hash;
      }
      next();
});

const Center=mongoose.model('Center',centerSchema);

module.exports=Center;