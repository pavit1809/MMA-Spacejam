import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import CenterLoginNavbar from "./CenterLoginNavbar";
import "./CenterLoginHome.css";
import Footer from "./Footer";
import * as actionTypes from './store/actions';
import TnCModal from "./TnCModal";
import {connect} from 'react-redux';
import Axios from "axios";
import {Button} from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table, 
  TableBody,
  TableCell, 
  TableContainer,
  TableHead,
  TablePagination, 
  TableRow 
}
from '@material-ui/core';
import TnCModal2 from "./TnCModal2";

const columns = [
  { id: 'Name', label: 'Name', minWidth: 170 , align: 'center'},
  { id: 'Test', label: 'Test Name', minWidth: 100 ,align: 'center' },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Slot',
    label: 'Slot Timings',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'PhoneNo',
    label: 'Contact Details',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Verify',
    label: 'Verify',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'userid',
    label: 'userid',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'appid',
    label: 'appid',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'flag',
    label: 'flag',
    minWidth: 170,
    align: 'center',
  },
];

function createData(Name, Test, date, Slot,PhoneNo,Verify,userid,appid,flag) {
  return {Name, Test, date, Slot,PhoneNo,Verify,userid,appid,flag};
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

function StickyHeadTable({appointments,ModalShow,handleModal1}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [start1, setStart] = React.useState(true);
  const convertToRows = (x) => {
    setStart(false);
    let ans = [];
    console.log(x)
    if(x.length==0){
      handleModal1(true);
      // ans.push(createData("No appointments available","--","--","--","--","--"));
      // setRows(ans);
    }
    else{
      console.log(x);
      for (let i = 0; i < x.length; i++) {
        ans.push(
          createData(
            x[i].Name,
            x[i].Test,
            x[i].Date,
            x[i].Slot,
            x[i].PhoneNo,
            x[i].Email,
            x[i].userid,
            x[i].appid,
            x[i].flag
          )
        );
      }
      setRows(ans);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleModal = (userid,appid) =>{
    ModalShow(userid,appid,true);
  }
  return (
    <Paper className={classes.root}>
      {start1 && convertToRows(appointments)}
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <>
                {(column.id!="appid" && column.id!="userid" && column.id!="flag") &&
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <b>{column.label}</b>
                  </TableCell>
                }
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if(column.id=="Verify" && row[column.id]!="--"){
                      return(
                        <TableCell key={column.id} align={column.align}>
                        <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="success" onClick={() => handleModal(row['userid'],row['appid'])} disabled={row['flag']==0}>{row['flag'] ? "Verify" : "Verified"}</Button>
                      </TableCell>
                        );
                    }
                    else if(column.id!="appid" && column.id!="userid" && column.id!="flag")
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export class CenterAppOfDay extends Component {
  state= {
    initiate:true,
    display:false,
    appointments:[],
    userid:"",
    appis:"",
    modal:false,
    ModalShow1:false,
    proceed:false,
  };
  handleAppOfDay = (data) =>{
    this.setState({initiate:false});
    const centerInfo={centerInfo:data};
    Axios.post("http://localhost:5000/center/presapp", centerInfo)
    .then((res) => {
      this.setState({appointments:res.data})
      this.setState({display:true});
    })
    .catch((err) => {
      console.log("Axios", err);
    this.setState({ModalShow1:true});
    });
  }
  ModalShow = (userid,appid,x) => {
    this.setState({userid:userid})
    this.setState({appid:appid})
    this.setState({modal:x})
  };
  handleModal = (x) =>{
    this.setState({ModalShow1:x});
  };
  proceedToHome = (x) =>{
    this.setState({proceed:true});
    this.setState({ModalShow1:x});
  };
  render() {
    const{ 
      initiate,
      display,
      appointments,
      userid,
      appid,
      modal,
      ModalShow1,
      proceed
    } = this.state;
    const values={
    }
    return(
      <div>
      <TnCModal
        btnshow={true}
        btntext={true}
        size="lg"
        name="No Appointments Scheduled"
        head="Please Try Again Later"
        show={ModalShow1}
        onHide={() => this.handleModal(false)}
        onAgree={() => this.proceedToHome(false)}
      />
      <TnCModal2
        size="lg"
        name="Verification of the patient"
        head="Verify the patient by entering identification number and phone OTP"
        show={modal}
        userid={userid}
        appid={appid}
        centerInfo={this.props.centerInfo}
        onHide={() => this.ModalShow(false)}
        onAgree={() => this.ModalShow(false)}
      />
      <CenterLoginNavbar
          centerInfo={this.props.centerInfo}
        />
      {initiate && this.handleAppOfDay(this.props.centerInfo)}
      {display && 
        <StickyHeadTable handleModal1={this.handleModal} appointments={appointments} ModalShow={this.ModalShow}/>
      }
       <Footer />
       {proceed &&
            <Redirect 
              to={{
                pathname: '/centerLoginHome', 
                // data: values
              }} 
            />

          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    centerInfo:state.centerInfo
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeCenterInfo: (centerInfo) => dispatch({type:actionTypes.CHANGE_CENTERINFO , centerInfo:centerInfo}),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(CenterAppOfDay);
