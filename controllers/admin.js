const { generatePassword } = require("../hooks/generalFunc");
const Doctor = require("../models/doctor");
const bcrypt = require('bcrypt');

exports.getAdminDashboard = async(req,res)=>{
    const doctors = await Doctor.find({ admin: false });

    res.render('admin/dashboard',{name:req.session.user.name,sex:req.session.user.sex,doctors});
  }

exports.getAdminProfile = async(req,res)=>{

  try {
    const profile = (await Doctor.findById(req.session.user.id)).toObject();
    delete profile.password;
    delete profile.resetCode;
    res.render('admin/profile',{sex:req.session.user.sex,profile});
  } catch (error) {
    console.log("There is an error in getAdminProfile")
  }

}

exports.AddDoctors = async(req,res)=>{
  const {rank, name, sex, mdc_number, hospital, department}=req.body;
  const password = generatePassword(12);
  bcrypt.hash(password, parseInt(process.env.saltRounds), async function(err, hash) {
    const doctor = new Doctor({
      name:name,
      password:hash,
      rank, sex, mdc_number, hospital, department
    });
    await doctor.save();
    res.status(201).json({doctor:doctor,password:password})
});
}