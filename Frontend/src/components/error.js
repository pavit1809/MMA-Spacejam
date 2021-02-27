export default function validateInfo(values) {
  let errors = {};
  errors.Password = (values.Password.length>7 );
  errors.PhoneNumber = (parseInt(values.PhoneNumber)>=1000000000 && parseInt(values.PhoneNumber)<=9999999999 );
  errors.Age = parseInt(values.Age)<121 && parseInt(values.Age)>0 ;
  errors.final=(parseInt(values.PhoneNumber)!==0 && values.Password!=="0" && values.UserName!=="0" && values.Email!=="0" && parseInt(values.Age)!==0  && errors.Password && errors.PhoneNumber && errors.Age);
  return errors;
}
 