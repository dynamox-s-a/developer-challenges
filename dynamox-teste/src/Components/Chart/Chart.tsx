import './Chart.scss'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function ChartDyna(props) {
    // console.log('aqui drento', props.dados)

    const options = {
        title: {
            text: '',
        },

        yAxis: {
            title: {
                text: props.yTitle
            },
            min: 0
        },

        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: ''
            },
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },

        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0,
                poiintInterval: 0,
                marker: {
                    enabled: false
                }
            }
        },

        series: props.dados,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    }
    return <>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </>
}

export default ChartDyna