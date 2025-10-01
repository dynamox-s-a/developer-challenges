import './BlockCharts.scss'

import ChartItem from '../ChartItem/ChartItem'
import { useSelector } from 'react-redux'
import type { RootState } from '../../Store/store'

function BlockChartsDyna() {
    const data = useSelector((state: RootState) => state.dataCharts)
    return <>
        <div id='BlockChartsDyna'>
            <ChartItem title="Aceleração RMS (g)" dados={data.acceleration}/>
            <ChartItem title="Temperatura (°C)" dados={data.temperature}/>
            <ChartItem title="Velocidade RMS (g)" dados={data.velocity}/>
        </div>
    </>
}

export default BlockChartsDyna