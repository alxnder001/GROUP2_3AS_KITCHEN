const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onClose, onConfirm, danger }) => {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-box">
        <h2>{title}</h2>
        {message && <p className="muted">{message}</p>}
        <div className="form-actions">
          <button className="button secondary" onClick={onClose}>{cancelLabel}</button>
          <button className={`button${danger ? ' danger' : ''}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
