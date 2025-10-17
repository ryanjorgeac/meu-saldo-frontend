import { useEffect } from 'react';
import { AlertTriangle } from '../icons'
import CloseX from '../common/CloseX'
import './ConfirmationModal.css';


const ConfirmationModal = ({ onClose, title, message, description, onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar', isDangerous = false }) => {
	useEffect(() => {
				document.body.style.overflow = 'hidden';
				return () => {
					document.body.style.overflow = 'auto';
				};
			}, []);
	
	return (
		<div className="confirmation-modal-overlay">
			<div className="confirmation-modal-content" onClick={e => e.stopPropagation()}>
				<div className="confirmation-modal">
					<div className="confirmation-modal-header">
            <div className="confirmation-modal-header-content">
              {isDangerous && <AlertTriangle fontSize="22" color="red" />}
              <h2>{title}</h2>
            </div>
            <CloseX onClick={onClose} />
					</div>

					<div className="confirmation-modal-body">
						<p>{message}</p>
						{description && <p className="confirmation-modal-description">{description}</p>}
					</div>
					<div className="confirmation-modal-footer">
						<button 
							type="button" 
							className="confirmation-modal-btn confirmation-modal-cancel-btn"
							onClick={onClose}
						>
							{cancelText}
						</button>
						<button 
							type="button" 
							className={`confirmation-modal-confirm-btn ${isDangerous ? 'confirmation-modal-danger' : ''}`}
							onClick={onConfirm}
						>
							{confirmText}
						</button>
					</div>
				</div>
				
			</div>
		</div>
	);
};

export default ConfirmationModal;
