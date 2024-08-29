const Doctor = require('../models/user');
const bcrypt = require('bcrypt');
const { generateResetCode } = require('../hooks/generalFunc');
const User = require('../models/user');


exports.loginUser = async (req,res)=>{
  let {code,password} = req.body;
  console.log("Loging in")
  try {
    const user =(await User.findOne({code:code})).toObject();
    if(user){
      bcrypt.compare(password, user.password, function(err, result) {
        delete user.password;
        delete user.resetCode;
        if(result === true){
            console.log(user)
            res.status(200).json(user);
        }else{
          res.status(401).send("wrong password");
        }
    });
    }else{
      res.status(401).send("wrong credentials");
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Check your internet");
  }

}

exports.registerUser = async (req,res)=>{
  let {password,email,username} = req.body;
  console.log('====================================');
  console.log(password,email);
  console.log('====================================');
  try {
    const user = await User.findOne({email:email});
    if(user){
      res.status(403).send("User with the email( "+email+" ) alredy exist");
    }else{
      bcrypt.hash(password, parseInt(process.env.saltRounds), async function(err, hash) {
        const client = new User({ email, username, password:hash });
        await client.save();
        // sendMail({email:client.email,id:client._id});
        res.status(200).json(client);
    }); 
      
    }
  } catch (error) {
    res.status(401).send("Unable to regiser user:"+error.message);
  }
}

exports.changePassword  = async(req,res)=>{
  const  {current_password,new_password,resetCode,code} = req.body;

  try {
    const doctor =await Doctor.findOne({code:code});
    const salt = bcrypt.genSaltSync(parseInt(process.env.saltRounds));
    const hash = bcrypt.hashSync(new_password, salt);
    const result = await bcrypt.compare(current_password, doctor.password);

    
    if(result === true || resetCode == doctor.resetCode){
      await Doctor.findOneAndUpdate({code:code}, {password:hash,resetCode:generateResetCode()});
      const doctorObj = (await Doctor.findOne({code:code})).toObject();
          delete doctorObj.password;
          delete doctorObj.code;
          delete doctorObj.resetCode;
          // const token = jwt.sign( {doctorObj}, process.env.TOKEN_KEY,);
          
          res.status(201).json(doctorObj);
        }else{
          res.status(401).send("wrong credentials");
        }
  } catch (error) {
    res.status(505).send(error.message);
  }
}

exports.editProfile = async(req,res)=>{
  let {doctorId,username,email} = req.body;
  try {
    const newData = await Doctor.findByIdAndUpdate(doctorId, {username,email});
  if(newData){
    const doctorObj =(await Doctor.findById(doctorId)).toObject();
    delete doctorObj.password;
    delete doctorObj.code;
    if(doctorObj){
      // const token = jwt.sign({doctorObj},process.env.TOKEN_KEY,);
      // res.status(200).send(token);
    }
  }else{
    res.status(505).send("Check your internet connnection and try again");
  }
  } catch (error) {
    res.status(505).send(error.message);
  }

}

// exports.forgetPassword = async(req,res)=>{
//   const {email} =req.body;
//   try {
//     const doctor = await Doctor.findOne({email:email});
//     if(doctor){
//       await messageDoctor(doctor);
//       res.send("Done");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

exports.verifyCode = async(req,res)=>{
  const  {code,resetCode} = req.body;

  try {
    const doctor = await Doctor.findOne({code:code});
    if(doctor && (doctor.resetCode == resetCode)){
    res.send({status:true,resetCode});
  }else{
    res.send({status:false});
  }
  } catch (error) {
    console.error(error.message);
  }
}