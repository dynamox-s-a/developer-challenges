import './Subtitle.scss'

import SubtitleBlockDyna from '../SubtitleBlock/SubtitleBlock'

function SubtitleDyna() {
    return <>
        <div id='SubtitleDyna'>
            <SubtitleBlockDyna text="Máquina 1023" icon="smart_toy"/>
            <SubtitleBlockDyna text="Ponto 20192" icon="my_location"/>
            <SubtitleBlockDyna text="200" icon="360"/>
            <SubtitleBlockDyna text="16g" icon="ssid_chart"/>
            <SubtitleBlockDyna text="20 min" icon="query_builder"/>
        </div>
    </>
}

export default SubtitleDyna