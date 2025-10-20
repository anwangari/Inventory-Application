// ============================================
// FILE: client/src/components/modals/DeleteModal.jsx
// ============================================
import Modal from '../common/Modal';
import Button from '../common/Button';
import '../../styles/Modal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="small">
      <div className="delete-modal-content">
        <p>Are you sure you want to delete this {itemType}?</p>
        <p className="item-name">"{itemName}"</p>
        <p className="warning-text">This action cannot be undone.</p>
      </div>
      
      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;