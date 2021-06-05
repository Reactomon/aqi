import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import './AqiDashboard.css';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const AQIDashboard = () => {
    const [aqiCityWiseData, setAqiCityWiseData] = useState([]);
    const classes = useStyles();
    let socket, mountTime = new Date();

    useEffect(() => {
        socket = new WebSocket('ws://city-ws.herokuapp.com');

        socket.addEventListener('open', function (event) {
            socket.send('Connection established!');
        });

        socket.addEventListener('message', function (event) {
            const data = JSON.parse(event.data) || [];
            const updateTime = new Date();
            const seconds = (updateTime.getTime() - mountTime.getTime()) / 1000;
            mountTime = new Date();
            data.forEach(d => {
                d.seconds = seconds;
                d.light = findAQILights(d.aqi)
            });
            setAqiCityWiseData(data || []);
        });

        return () => {
            socket.removeEventListener('open', function (event) {
                socket.send('Connection established!');
            });

            socket.removeEventListener('message', function (event) {
                console.log('Message from server ', event.data);
            });
        }
    }, []);

    const findAQILights = (aqiValue = 0) => {
        let color;
        if (aqiValue >= 0 && aqiValue <= 50) color = "#33cc33";
        else if (aqiValue >= 51 && aqiValue <= 100) color = "#ebfaeb";
        else if (aqiValue >= 101 && aqiValue <= 200) color = "#ffff00";
        else if (aqiValue >= 200 && aqiValue <= 30) color = "#ffb84d";
        else if (aqiValue >= 300 && aqiValue <= 400) color = "#ff5c33";
        else if (aqiValue >= 400 && aqiValue <= 500) color = "#991f00";
        else color = "#991f00";
        return color;
    }

    return (
        <div className="parentContainer">
            <TableContainer component={Paper} className="tablePrimary">
                <div className="tableHeading tableHeadCells">
                    Air Quality
            </div>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="tableHeadCells">City</TableCell>
                            <TableCell className="tableHeadCells">Current AQI</TableCell>
                            <TableCell align="right" className="tableHeadCells">Last Updated At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {aqiCityWiseData.map((row) => {
                            let updateHistory;
                            const isInFeasMinutes = Math.floor(row.seconds / (60));
                            if (row.seconds <= 60) updateHistory = `${Math.floor(row.seconds)} seconds ago`;
                            else updateHistory = `${isInFeasMinutes} minutes ago`;
                            return (
                                <TableRow key={row.name} style={{ backgroundColor: row.light }}>
                                    <TableCell component="th" scope="row">
                                        {row.city}
                                    </TableCell>
                                    <TableCell>{row.aqi.toFixed(2)}</TableCell>
                                    <TableCell align="right">{updateHistory}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Chart data={aqiCityWiseData}/>
        </div>
    );
}

export default AQIDashboard;