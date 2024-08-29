const express = require("express");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Section = require('../models/session');
const axios = require('axios');
const Patient = require("../models/patient");
const Session = require("../models/session");

const router = express.Router();

router.route("/")
.post(async (req,res)=>{
  try {
    let num = req.body.firstTimer ==true?'1':'2';

    let PatientData =req.body;
    const url = 'https://predect-model.onrender.com/predict/'+num;
    
    const response = await axios.post(url,PatientData);
    
    res.send({...response.data});
  } catch (error) {
    console.error(error.message);
  }
});

router.route('/update')
.post(async(req,res)=>{
  const {sectionId,current, frequency, d_o_s, pulse_width,energy,duration,resistance,note} = req.body;
  try {
    await Session.findByIdAndUpdate(sectionId,{
      actual_Current:current,
      actual_Frequency:frequency,
      actual_Duration_of_Stimulation:d_o_s,
      actual_Pulse_with:pulse_width,
      actual_Energy:energy,
      actual_DURATION_OF_TONIC_CLONIC_MUSCULAR_ACTIVITY:duration,
      actual_Resistance:resistance,note
    });
    res.send("Done!")
  } catch (error) {
    console.log("Error occure when updating session doc")
  }
})


module.exports = router;