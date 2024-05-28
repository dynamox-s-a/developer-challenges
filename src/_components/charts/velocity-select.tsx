import { setScope } from "../../store/slices/measuresSlice";
import { useAppDispatch, useAppSelector } from "../../store";

export function VelocitySelect(){
  const scope: string = useAppSelector(store => store.measures.scope.velocity)

  const dispatch = useAppDispatch()

  function handleScopeChange(event: React.ChangeEvent<HTMLSelectElement>){
    const newScope = event.target.value;

    const velocityScope = {
      type: 'velocity',
      selectScope: newScope
    }

    dispatch(setScope(velocityScope));
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