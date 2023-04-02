export default function Input({type, placeholder, name, id, setData}) {
  return (
    <input type={type} placeholder={placeholder} name={name} id={id} required onChange={(e) => setData(e.target.value)} className='contato-input'/>
  )
}
