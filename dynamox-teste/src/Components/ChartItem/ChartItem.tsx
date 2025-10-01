import './ChartItem.scss'
import ChartDyna from '../Chart/Chart'

function ChartItemDyna(props) {
    return <>
        <div id='ChartItemDyna'>
            <div className='titleChart'>{props.title}</div>
            <div className="chartBlock">
                <ChartDyna dados={props.dados} yTitle={props.title}/>
            </div>
        </div>
    </>
}

export default ChartItemDyna