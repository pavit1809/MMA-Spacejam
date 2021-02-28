import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import CenterLoginNavbar from "./CenterLoginNavbar";
import "./CenterLoginHome.css";
import Footer from "./Footer";
import * as actionTypes from './store/actions';
import {connect} from 'react-redux';
import Axios from "axios";
import {Button} from 'react-bootstrap';
import TnCModal from "./TnCModal";
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

const columns = [
  { id: 'Name', label: 'Name', minWidth: 170 ,align: 'center'},
  { id: 'Test', label: 'Service', minWidth: 100 ,align: 'center' },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Slot',
    label: 'Slot Details',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'PhoneNo',
    label: 'Contact',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'Sendresult',
    label: 'Result',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'appInfo',
    label: 'appInfo',
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

function createData(Name, Test, date, Slot,PhoneNo,Sendresult,appInfo,flag) {
  return {Name, Test, date, Slot,PhoneNo,Sendresult,appInfo,flag};
}



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

function StickyHeadTable({appointments,handleModal,centerInfo}) {
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
      handleModal(true);
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
            x[i],
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
  const handleClickBtn = (value,appInfo) =>{
    window.location.assign("mailto:"+value);
    const data={centerInfo,appInfo}
    Axios.post("http://localhost:5000/center/sendres", data)
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log("Axios", err);
    });
  };
  return (
    <Paper className={classes.root}>
      {start1 && convertToRows(appointments)}
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                 <>
                {(column.id!="appInfo" && column.id!="flag") &&
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
                    if(column.id=="Sendresult" && row[column.id]!="--"){
                      return(
                        <TableCell key={column.id} align={column.align}>
                        <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="success" onClick={()=> handleClickBtn(value,row['appInfo'])}>{row["flag"]==1 ? "Send " : "Resend"}</Button>
                      </TableCell>
                        );
                    }
                    if(column.id=="appInfo" || column.id=="flag"){
                      ;
                    }
                    else
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

export class CenterSendResult extends Component {
  state= {
    initiate:true,
    display:false,
    appointments:[],
    ModalShow:false,
    proceed:false
  };
  handleSendResult = (data) =>{
    this.setState({initiate:false});
    const centerInfo={centerInfo:data};
    Axios.post("http://localhost:5000/center/prevapp", centerInfo)
    .then((res) => {
      this.setState({appointments:res.data})
      this.setState({display:true});
    })
    .catch((err) => {
      console.log("Axios", err);
      this.setState({ModalShow:true});
    });
  };
  handleModal = (x) =>{
    this.setState({ModalShow:x});
  };
  proceedToHome = (x) =>{
    this.setState({proceed:true});
    this.setState({ModalShow:x});
  };
  render() {
    const{ 
      initiate,
      display,
      appointments,
      ModalShow,
      proceed
    } = this.state;

    return(
      <div>
      <TnCModal
        btnshow={true}
        btntext={true}
        size="lg"
        name="No Appointments Scheduled"
        head="Please Try Again Later"
        show={ModalShow}
        onHide={() => this.handleModal(false)}
        onAgree={() => this.proceedToHome(false)}
      />
      <CenterLoginNavbar
          centerInfo={this.props.centerInfo}
        />
      {initiate && this.handleSendResult(this.props.centerInfo)}
      {display && 
        <StickyHeadTable centerInfo={this.props.centerInfo} handleModal={this.handleModal} appointments={appointments}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(CenterSendResult);
