const Button = ({ onClick, children, className }) => {
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
}; 
export default Button;
