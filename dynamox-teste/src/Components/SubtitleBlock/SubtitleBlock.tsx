import './SubtitleBlock.scss'

function SubtitleBlockDyna(props) {
    return <>
        <div id='SubtitleBlockDyna'>
            <span className="material-icons iconSubtitle">
                {props.icon}
            </span>
            <span className="textSubtitle">{props.text}</span>
        </div>
    </>
}

export default SubtitleBlockDyna