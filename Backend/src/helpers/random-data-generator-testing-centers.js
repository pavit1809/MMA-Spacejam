const faker = require("faker");
const axios=require('axios');
const Center=require('../models/center');
const fs=require('fs');

let data = [];
const NewCentre = async (add, nearland, city, pincode, state, county, nam) => {
  const start = (8 + (faker.random.number() % 4)).toString() + ":00 AM";
  const end = (5 + (faker.random.number() % 4)).toString() + ":00 PM";
  const centerdata = {
    Name: nam,
    Address: add,
    PhoneNo: faker.phone.phoneNumber(),
    Email: faker.internet.email(),
    Password: faker.internet.password(),
    OpeningTime: start,
    ClosingTime: end,
    Status: true,
    NearestLandmark: nearland,
    City: city,
    Pincode: pincode,
    State: state,
    Country: county,
    FrontImage: faker.image.business(),
    LicenceNum: faker.random.uuid(),
    Reviews: [
      {
        text: faker.company.catchPhrase(),
        stars: 3 + (faker.random.number() % 3),
      },
      {
        text: faker.company.catchPhrase(),
        stars: 3 + (faker.random.number() % 3),
      },
      {
        text: faker.company.catchPhrase(),
        stars: 3 + (faker.random.number() % 3),
      },
      {
        text: faker.company.catchPhrase(),
        stars: 3 + (faker.random.number() % 3),
      },
    ],
    AvgStars: 5,
  };
  data.push(centerdata);
};
const SampleAddresses = [
  "Vasundhara Enclave,Dharamshila Road,Near New Ashok Nagar Metro Station New Ashok Nagar,New Delhi-110096",
  "B-294, opposite East End Appts,Mayur Vihar phl extension,Near Ashok Nagar Metro Station-On main road New Ashok Nagar,New Delhi-110096",
  "B-294, New Ashok Nagar Extension,Opposite East End Apartment,Mayur Vihar Phase 1 Mayur Vihar,New Delhi-110091",
  "C 242,C Block,Main Road,Near Kali Badi Mandir New Ashok Nagar,New Delhi-110096",
  "B-357,New Ashok Nagar,New Delhi-110096",
  "Shop No. B-7,Sarpanch Market,Ashok Nagar Extension New Ashok Nagar,New Delhi-110096",
  "B-1266/1267, Shop No. 9 R.S.TOWER,Opposite Metro Pillar No. 156, Near Metro Station New Ashok Nagar,New Delhi-110096",
  "B-20,Near Defence Public School New Ashok Nagar,New Delhi-110096",
  "E 411 A,Taksal Road and 40 Foota Road,Near Rakdhani Public School New Ashok Nagar,New Delhi-110096",
  "B108 Street No 2 New Ashok Nagar New Ashok Nagar,New Delhi-110096",
];
const Names = [
  "Dharamshila Hospital and Research Centre",
  "Diabetes Care Centre",
  "Total Care Control",
  "Rajdhani Medical Centre",
  "Dr Lal Pathlabs,New Ashok Nagar",
  "East End Hospital",
  "HealthScan Pathology Laboratory",
  "DPMI Diagnostic Centre",
  "Sai Polyclinic",
  "Pathfinders Labs(New Ashok Nagar)New Delhi",
];
const Pincodes = [
  "110096",
  "110096",
  "110091",
  "110096",
  "110096",
  "110096",
  "110096",
  "110096",
  "110096",
  "110096",
];
const States = [
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
  "New Delhi",
];
const Countries = [
  "India",
  "India",
  "India",
  "India",
  "India",
  "India",
  "India",
  "India",
  "India",
  "India",
];
const Cities = [
  "New Ashok Nagar",
  "New Ashok Nagar",
  "Mayur Vihar",
  "New Ashok Nagar",
  "New Ashok Nagar",
  "New Ashok Nagar",
  "New Ashok Nagar",
  "New Ashok Nagar",
  "New Ashok Nagar",
  "New Ashok Nagar",
];
const Landmarks = [
  "Dharamshila Road",
  "Mayur Vihar phl extension Ashok Nagar Metro Station ",
  "Opposite East End Apartment Mayur Vihar Phase 1 ",
  "Kali Badi Mandir",
  "New Ashok Nagar,",
  "Sarpanch Market Ashok Nagar Extension",
  "R.S.TOWER",
  "Defence Public School",
  "Taksal Road and 40 Foota Road Rakdhani Public School",
  "Street No 2",
];

for (let i = 0; i < 10; i++) {
  NewCentre(
    SampleAddresses[i],
    Landmarks[i],
    Cities[i],
    Pincodes[i],
    States[i],
    Countries[i],
    Names[i]
  );
}
for (let i = 0; i < 10; i++) {
  const apicallcompleteaddress=Landmarks[i]+' '+Pincodes[i]+' '+Cities[i]+' '+States[i]+' '+Countries[i];
  const flag=JSON.stringify(data[i]);
  fs.appendFileSync('demo-center-data',flag);
  fs.appendFileSync('demo-center-data',"\n");
}
