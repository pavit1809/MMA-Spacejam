export default function validateInfo(values) {
  let errorsL = {};
  errorsL.final=(values.password!==0  && values.email!=="0");
  
  return errorsL;
} 