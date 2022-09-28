import './styles.css';

export function Modal({ form }) {
  function toggleModal(event, isModal=false) {
    if(isModal) {
      if (event.target.parentElement === document.querySelector('.modal-overlay')) {
        document.querySelector('.modal-overlay').classList.toggle('active')
        return
      }
    } else {
      document.querySelector('.modal-overlay').classList.toggle('active');
    }
  }

  return(
    <div className="modal-overlay" onClick={(e) => toggleModal(e, true)}>
      <div className="modal">
        <div className="modal-card">
          <h4>Logo mais entraremos em contato com você, {form.nome.split(' ')[0]}</h4>
          <strong>Informações enviadas:</strong>
          {Object.keys(form).map((key) => (
            <p key={key}>{key[0].toUpperCase() + key.substring(1)}: {form[key]}</p>
          ))}
          <button onClick={toggleModal}>Fechar</button>
        </div>
      </div>
    </div>
  )
}