import './Data.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import NavBarDyna from '../../Components/NavBar/NavBar';
import SubtitleDyna from '../../Components/Subtitle/Subtitle';
import BlockChartsDyna from '../../Components/BlockCharts/BlockCharts';
import { useEffect } from 'react';
import { getDataCharts } from '../../Service/DataCharts';
import { attData } from '../../Store/DataChats';
import { useDispatch } from 'react-redux';

function Data() {
  const dispatch = useDispatch()
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDataCharts();
        dispatch(attData(response))
        console.log('Vortooou', response)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getData();
  }, []); 

  return (
    <>
    <div id="dataView">
        <NavBarDyna/>
        <div id="viewData">
          <SubtitleDyna/>
          <BlockChartsDyna/>
        </div>
    </div>
    </>
  )
}

export default Data
