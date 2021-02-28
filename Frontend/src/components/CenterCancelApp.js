import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import CenterLoginNavbar from "./CenterLoginNavbar";
import "./CenterLoginHome.css";
import Footer from "./Footer";
import * as actionTypes from './store/actions';
import {connect} from 'react-redux';
import TnCModal from "./TnCModal";
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
import TnCModal3 from "./TnCModal3";

const columns = [
  { id: 'Name', label: 'Name', minWidth: 170 ,align: 'center',},
  { id: 'Test', label: 'Test Name', minWidth: 100 ,align: 'center',},
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
    label: 'Phone Number',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Email',
    label: 'Email ID',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Cancel',
    label: 'Cancel',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'appInfo',
    label: 'appInfo',
    minWidth: 170,
    align: 'center',
  },
];

function createData(Name, Test, date, Slot,PhoneNo,Email,Cancel,appInfo) {
  return {Name, Test, date, Slot,PhoneNo,Email,Cancel,appInfo};
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
      // ans.push(createData("No appointments available","--","--","--","--","--","--"));
      // setRows(ans);
    }
    else{
      console.log(x);
      for (let i = 0; i < x.length; i++) {
        ans.push(
          createData(
            x[i].Name,
            x[i].Test,
            x[i].date,
            x[i].Slot,
            x[i].PhoneNo,
            x[i].Email,
            0,
            x[i],
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
  const handleModal = (appInfo) =>{
    ModalShow(appInfo,true);
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
                {(column.id!="appInfo" ) &&
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                   <b> {column.label}</b>
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
                    if(column.id=="Cancel" && row[column.id]!="--"){
                      return(
                        <TableCell key={column.id} align={column.align}>
                        <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="danger" onClick={() => handleModal(row['appInfo'])} >Cancel</Button>
                      </TableCell>
                        );
                    }
                    else if(column.id!="appInfo")
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
    appis:"",
    modal:false,
    ModalShow1:false,
    proceed:false
  };
  handleCancelApp = (data) =>{
    this.setState({initiate:false});
    const centerInfo={centerInfo:data};
    Axios.post("http://localhost:5000/center/futapp", centerInfo)
    .then((res) => {
      this.setState({appointments:res.data})
      this.setState({display:true});
    })
    .catch((err) => {
      console.log("Axios", err);
    this.setState({ModalShow1:true});
    });
  }
  ModalShow = (appInfo,x) => {
    this.setState({appInfo:appInfo})
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
      appInfo,
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
      <TnCModal3
        size="lg"
        name="Cancel The Appointment"
        head="State an appropriate reason for cancelling the appointment"
        show={modal}
        appInfo={appInfo}
        centerInfo={this.props.centerInfo}
        onHide={() => this.ModalShow(false)}
        onAgree={() => this.ModalShow(false)}
      />
      <CenterLoginNavbar
          centerInfo={this.props.centerInfo}
        />
      {initiate && this.handleCancelApp(this.props.centerInfo)}
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
