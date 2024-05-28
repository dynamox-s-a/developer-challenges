import { setScope } from "../../store/slices/measuresSlice";
import { useAppDispatch, useAppSelector } from "../../store";

export function TemperatureSelect(){
  const scope: string = useAppSelector(store => store.measures.scope.temperature)

  const dispatch = useAppDispatch()

  function handleScopeChange(event: React.ChangeEvent<HTMLSelectElement>){
    const newScope = event.target.value;

    const temperatureScope = {
      type: 'temperature',
      selectScope: newScope
    }

    dispatch(setScope(temperatureScope));
  }

  return(
    <>
      <select name="scopeSelect" id="scopeSelect" onChange={handleScopeChange} value={scope}>
        <option value="lastDay">day</option>
        <option value="lastWeek">week</option>
        <option value="lastMonth">month</option>
        <option value="lastYear">year</option>
        <option value="">All</option>
      </select>
    </>
  )
}