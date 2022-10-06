import React, { useState } from 'react'


function Contact() {
//Ao clicar em "Enviar", website deve emitir alerta contendo o conteúdo dos campos do formulário de contato.
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [company, setCompany] = useState('')
const [phone, setPhone] = useState('')

const handleSubmit = (e) => {
  e.preventDefault()
  alert(`Nome: ${name} Email: ${email} Empresa: ${company} Telefone: ${phone}`)
}



  return (
    <div className="bg-[#263252] h-[450px] p-8">
          <span className= "pt-4 block w-[250]  text-sm text-center  text-white">Ficou com dúvida?</span>
          <span className= " pb-4 block text-sm text-center  text-white">Nós entramos em contato com você</span>
          <section id="contact"> 
        <div>
          <form action="#">
            <div className="flex flex-col justify-center items-center">
              <input type="text" name="name"placeholder="Como gostaria de ser chamado?" className="w-2/4 border-2 border-[#263252] rounded-lg p-2 m-2" 
              onChange={(e) =>setName(e.target.value)}/>
              <input type="text" name="company" placeholder="Em qual empresa você trabalha?" className="w-2/4 border-2 border-[#263252] rounded-lg p-2 m-2" 
              onChange={(e) =>setCompany(e.target.value)}/>
              <input type="text" name="email"placeholder="Email" className="w-2/4 border-2 border-[#263252] rounded-lg p-2 m-2" 
              onChange={(e) =>setEmail(e.target.value)}/>
              <input type="text" name="phone"placeholder="Telefone" className="w-2/4 border-2 border-[#263252] rounded-lg p-2 m-2" 
              onChange={(e) =>setPhone(e.target.value)}/>
              <button onClick={handleSubmit} type="submit"className="bg-[#0165DB] text-white text-base px-8 p-2 rounded-lg ">Enviar</button>
            </div>
          
          </form>
          
        </div>
          
</section>

          
        </div>
    )
}

export default Contact
