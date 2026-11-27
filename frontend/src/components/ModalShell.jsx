const ModalShell = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-box">
        <button className="close" onClick={onClose}>&times;</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
