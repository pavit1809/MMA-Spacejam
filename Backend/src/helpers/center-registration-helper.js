const daysarr=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const formatdate=(curr)=>{
      let month=curr.getMonth();
      month++;
      month=month.toString();
      if (month.length==1)
      {
            month="0"+month;
      }
      let date=curr.getDate();
      date=date.toString();
      if (date.length==1)
      {
            date="0"+date;
      }
      return curr.getFullYear()+'-'+month+'-'+date;
}

const formattimestring=(time)=>{
      if(parseInt(time[0]+time[1])<12){
            return time+' AM';
      }
      else{
            let hr=parseInt(time[0]+time[1]);
            if (hr!=12){
                  hr-=12;
            }
            return ((hr.toString().length==1)?'0':'')+hr.toString()+':'+time[3]+time[4]+' PM';
      }
}

const extracthr=(time)=>{
      if (time.length==7)
      {
            return (parseInt(time[0]));
      }
      return parseInt(time[0]+time[1]);
}

const extractmin=(time)=>{
      if (time.length==7)
      {
            return (parseInt(time[2]+time[3]));
      }
      return parseInt(time[3]+time[4]);
}

const extracttz=(time)=>{
      if (time.length==7)
      {
            return time[5]+time[6];
      }
      return time[6]+time[7];
}

const formathelp=(entity)=>{
      if (entity<10)
      {
            return "0"+entity.toString();
      }
      return entity.toString();
}     

const helper=(starttime,endtime)=>{
      let hs=extracthr(starttime);
      let ms=extractmin(starttime);
      let he=extracthr(endtime);
      let me=extractmin(endtime);
      let st=extracttz(starttime);
      let et=extracttz(endtime);
      let arr=[];
      console.log(hs,ms,he,me,st,et);
      if (st=='AM' && et=='AM' && hs<=he){
            if (st==et){
                  while ((hs!=he) || (ms!=me)){
                        let tbp=formathelp(hs)+':'+formathelp(ms)+' '+st+" - ";
                        if (ms==30){
                              ms=0;
                              hs+=1;
                        }
                        else{
                              ms+=30;
                        }
                        tbp+=(formathelp(hs)+':'+formathelp(ms)+' '+st);
                        arr.push(tbp);
                  }
            }
      }
      else if (st=='AM' && et=='AM' && hs>he){
            while ((hs!=12) || (ms!=0)){
                  let tbp=formathelp(hs)+':'+formathelp(ms)+' '+st+" - ";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  if (hs==12){
                        tbp+=(formathelp(hs)+':'+formathelp(ms)+' '+et);      
                  }
                  else{
                        tbp+=(formathelp(hs)+':'+formathelp(ms)+' '+st);
                  }
                  arr.push(tbp);
            }
            he+=12;
            while ((hs!=he) || (ms!=me)){
                  let ths1=hs;
                  if (ths1!=12){
                        ths1-=12;
                  }
                  let tbp=formathelp(ths1)+':'+formathelp(ms)+' '+et+"-";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  let ths=hs;
                  if (ths!=12){
                        ths-=12;
                  }
                  tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+et);
                  arr.push(tbp);
            }
      }
      else if (st=='AM' && et=='PM'){
            while ((hs!=12) || (ms!=0)){
                  let tbp=formathelp(hs)+':'+formathelp(ms)+' '+st+" - ";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  if (hs==12){
                        tbp+=(formathelp(hs)+':'+formathelp(ms)+' '+et);      
                  }
                  else{
                        tbp+=(formathelp(hs)+':'+formathelp(ms)+' '+st);
                  }
                  arr.push(tbp);
            }
            if (hs!=he)
                  he+=12;
            while ((hs!=he) || (ms!=me)){
                  let ths1=hs;
                  if (ths1!=12){
                        ths1-=12;
                  }
                  let tbp=formathelp(ths1)+':'+formathelp(ms)+' '+et+" - ";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  let ths=hs;
                  if (ths!=12){
                        ths-=12;
                  }
                  tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+et);
                  arr.push(tbp);
            }
      }
      else if (st=='PM' && et=='PM'){
            if (hs!=12){
                  hs+=12;
            }
            if (he!=12){
                  he+=12;
            }
            while ((hs!=he) || (ms!=me)){
                  let ths1=hs;
                  if (ths1!=12){
                        ths1-=12;
                  }
                  let tbp=formathelp(ths1)+':'+formathelp(ms)+' '+'PM'+" - ";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  let ths=hs;
                  if (ths!=12){
                        ths-=12;
                  }
                  if (ths==0)
                        tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+'AM');
                  else
                        tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+'PM');
                  arr.push(tbp);
            }
      }
      else if (st=='PM' && et=='AM'){
            he=24;
            if (hs!=12)
                  hs+=12;
            while ((hs!=he) || (ms!=me)){
                  let ths1=hs;
                  if (ths1!=12){
                        ths1-=12;
                  }
                  let tbp=formathelp(ths1)+':'+formathelp(ms)+' '+'PM'+" - ";
                  if (ms==30){
                        ms=0;
                        hs+=1;
                  }
                  else{
                        ms+=30;
                  }
                  let ths=hs;
                  if (ths==24){
                        ths=0;

                  }
                  else if (ths!=12){
                        ths =12;
                  }
                  if (ths==0)
                        tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+'AM');
                  else
                        tbp+=(formathelp(ths)+':'+formathelp(ms)+' '+'PM');
                  arr.push(tbp);
            }
      }
      return arr;
}

// console.log(helper("11:00 AM","11:00 PM"));
// console.log(helper("11:30 AM","12:30 PM"));
// console.log(helper("11:30 PM","00:00 AM"));
// console.log(helper("12:00 AM","01:00 PM"));
// console.log(helper("00:30 AM","12:30 PM"));
// console.log(helper("11:30 AM","12:00 PM"));
// console.log(helper("10:30 AM","11:00 AM"));

// starttime,endtime
const listofnextsevendays=(blockeddays,date1,cap,starttime,endtime)=>{
      let curr=new Date(date1);
      curr.setDate(curr.getDate()+1);
      let ret=[];
      const intervals=helper(starttime,endtime);
      while (ret.length<7)
      {
            const currday=daysarr[curr.getDay()];
            const found=blockeddays.find(element=>element==currday);
            if (found==undefined)
            {
                  const date2=formatdate(curr);
                  let arr=[];
                  for(let i=0;i<intervals.length;i++)
                  {
                        const flag1={
                              det1:intervals[i],
                              det2:cap
                        }
                        arr.push(flag1);
                  }
                  const obj1={
                        date:date2,
                        slotinfo:arr
                  }
                  ret.push(obj1);
            }
            curr.setDate(curr.getDate()+1);
      }
      return ret;
}

const alteredlist=(initiallist,blockeddays)=>{
      let currdate=initiallist[initiallist.length-1].date;
      let curr=new Date(currdate);
      curr.setDate(curr.getDate()+1);
      while (initiallist.length<7)
      {
            const currday=daysarr[curr.getDay()];
            const found=blockeddays.find(element=>(element==currday));
            if (found==undefined)
            {
                  const date2=formatdate(curr);
                  const obj1={
                        date:date2,
                        slotinfo:initiallist[initiallist.length-1].slotinfo
                  }
                  initiallist.push(obj1);
            }            
            curr.setDate(curr.getDate()+1);
      }
      return initiallist;
}


module.exports={listofnextsevendays,formatdate,alteredlist,formattimestring};