# MMA-Spacejam:

 This is the official repository for the Make My Appointment Project by Team-Internal Server Error for Spacejam.
 
# Problem Statement:

Ever since the COVID-19 Pandemic happened, people are getting more and more concerned about their well-being and health. 
Testing labs for various diseases are flooded with loads of appointments and due to lack of proper management of the appointments, applicants end up waiting a lot especially during rush hours.

# Proposed Solution:

Our solution aims at developing a robust portal that will give the user multiple options for different types of tests with complete details of all slots for a particular date including their vacancies. We will be filtering testing centers and also the distance from the user using geolocation APIs. The users can select a centre based on the reviews and ratings given by other customers.

Using this, the testing labs will also have a single place to check in with all their appointments for all the tests of the day as well as sending out the results through email. They can also provide the details of the facilities they provide.

# Facilities Provided:

 -> User and Test Centre Registration and Login<br>
 -> Validation using OTP<br>
 -> Test Centre Appointment booking using Geolocation Here API to show the customers the nearest test centre offering the tests wanted by the user on a particular date and slot<br>
 -> Viewing history of all appointments by User<br>
 -> Test Centre have the option of sending all the results using email, viewing all appointments and also cancelling<br>
 -> They can also add facilities for other tests<br>
 -> Review and Rating collection from past customers<br>
 -> Sentimental Analysis of the Reviews using NLP SVC Model for informing users what opinion people have of that test centre for better decision making<br>
 
# Tech Stack: (Web Dev, NLP)

   Tools:<br>
     Visual Studio Code<br>
     Sublime Text<br>
     Postman<br>
     ngrok<br>
     Robo 3T<br>
     Chrome Developer Tools<br>
     Google Colab<br>
     MongoDB <br>
   Languages:<br>
     Python<br>
     Javascript<br>
   Frameworks:<br>
     Reactjs<br>
     Nodejs<br>
     Flask App<br>
     
# Implementation:
 
 ### Video: https://youtu.be/NCCXAgOLxQI
 ### PPT: https://docs.google.com/presentation/d/1_rY8_yDaeLyqM2j8ItVSv1t8q3Ro3SzguGGeMJekQsQ/edit?usp=sharing
 
# FRONTEND

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
  
# BACKEND
## TO RUN ON LOCAL MACHINE<br>
### COMMAND: `npm run dev` in Backend directory<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.<br>

1. Create a .env file in the backend-root directory on your local machine with the following format<br>
TEST_MAIL=(Mail ID for sending the cancellation messages and verifications emails)<br>
TEST_PASS=(Password of the mail ID)<br>
API_KEY=(API KEY for the HERE Platform)<br>
SECRET=(Secret for the vonage API service)<br>
VKEY=(Key for the vonage API service)<br>
SERVICE=(Service of the mail ID as in hotmail,yahoo,gmail etc)<br>
AUTHSRT=(Token for the authentication service)<br>
