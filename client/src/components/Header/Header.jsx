import './Header.css'
import createIcon from '../../assets/images/create.png'
import { useState } from 'react'
import Modal from "react-modal"
import { Form } from '../Form/Form'
import { CgClose } from "react-icons/cg";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "45rem",
    height: "26rem",
    transform: "translate(-50%, -50%)",
    backgroundColor: " rgba(0, 0, 0, 0.8)",
    borderRadius: "15px",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.4)",
  },
};

Modal.setAppElement("#root");

export function Header() {

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleModal() {
    setModalIsOpen(!modalIsOpen);
  }

  return (
    <div className='header'>
      <header>
        <div className='row'>
          <div className="Logo">
            <span className='Logo-title'>Produtos</span>
          </div>
          <div >
            <button className="btn-create-icon" onClick={handleModal}>
              <img src={createIcon} alt="botão de criar um produto" className='Create--icon' width='40px' />Adicionar
            </button>
          </div>
        </div>
      </header>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModal}
        style={customStyles}
        contentLabel="form Create"
      >
        <section
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              cursor: "pointer",
              border: "none",
            }}
            onClick={handleModal}
          >
            <CgClose size={28} color="red" />
          </button>
        </section>
        <Form />
      </Modal>
    </div>
  )
}