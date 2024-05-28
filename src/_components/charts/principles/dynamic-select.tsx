import { useState } from "react";
import { setScope } from "../../../store/slices/measuresSlice";
import { useAppDispatch } from "../../../store";

export function DynamicSelect(){
  const [selectScope, setSelectScope] = useState('lastWeek')
  const disptach = useAppDispatch()

  function handleScopeChange(event: React.ChangeEvent<HTMLSelectElement>){
    setSelectScope(event.target.value);
    disptach(setScope(selectScope))
  }

  return(
    <>
      <select name="scopeSelect" id="scopeSelect" onChange={handleScopeChange} value={selectScope}>
        <option value="lastDay">ultimo dia</option>
        <option value="lastWeek">ultima semana</option>
        <option value="lastMonth">ultimo mês</option>
        <option value="lastYear">ultimo ano</option>
        <option value="">Tudo</option>
      </select>
    </>
  )
}