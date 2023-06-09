import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles(() => ({
    container: {
        padding: '16px',
    },
    heading: {
        marginBottom: '16px',
        fontWeight: 'bold',
    },
    table: {
        minWidth: 650,
    },
}));

const AuditTrailPage = (props) => {
    const decodedToken = jwtDecode(props.token);
    const userRole = decodedToken.role;
    const userID = decodedToken.sub;
    const classes = useStyles();
    const [audits, setAudits] = useState(null);

    useEffect(() => {
        if (userRole === "Admin") {
            fetch('http://localhost:5000/audits', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + props.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    data.access_token && props.setToken(data.access_token)
                    console.log(data)
                    setAudits(data)
                })
                .catch(error => console.error(error));
        }
    }, []);


    return (
        <div className={classes.container}>
            <Typography variant="h5" className={classes.heading}>
                Audit Trail
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>User</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audits?.map((item) => (
                            <TableRow key={item.ID}>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item.action}</TableCell>
                                <TableCell>{item.user}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AuditTrailPage;
