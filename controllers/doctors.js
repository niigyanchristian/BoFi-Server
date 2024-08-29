const { findSessions, findPatients } = require("../func/main");
const { findPatientsWithAppointmentToday, patientsVisits } = require("../hooks/generalFunc");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Session = require("../models/session");


exports.dashboard = async(req,res)=>{
    const totalAppointments=(await findSessions())?.length;
    const totalPatients=(await findPatients()).length;
    const session_males= await Session.find({GENDER:'Male'});
    const session_females= await Session.find({GENDER:'Female'});
    const MalePatientVisits = patientsVisits(session_males)
    const FemalePatientVisits = patientsVisits(session_females)
  

    
    
  const hasAppointment =await findPatientsWithAppointmentToday();
    res.render('dashboard',{
      sex:req.session.user.sex,
      totalAppointments,totalPatients,
      name:req.session.user.name,
      hasAppointment,
      MalePatientVisits,
      FemalePatientVisits
    });
  }

exports.getPatientProfile = async(req,res)=>{
    const patientId = req.query.id;
    const sessions = await Session.find({PatientID:patientId});
    const patient = await Patient.findById(patientId);
  
    res.render('patients_profile',{sessions,patient,sex:req.session.user.sex});
  }

exports.getProfile = async(req,res)=>{
  const profile = await Doctor.findById(req.session.user.id);

  res.render('profile',{sex:req.session.user.sex,profile});
}