import { LineChart } from 'react-chartkick'
import 'chartkick/chart.js'

const Chart = ({ data = [] }) => {
    debugger;
    let lineChartData;
    if(data.length) lineChartData = data?.reduce((acc, { city, aqi }) => ({
        ...acc,
        [city]: aqi
    }), {});
   
    return (
        <div className="chart">
            <div>AQI City wise plot</div>
            <LineChart data={lineChartData || []} />
        </div>
    )
}

export default Chart;