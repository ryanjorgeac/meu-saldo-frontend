import Modal from '../common/Modal';
import './CategoryModal.css';

const CategoryModal = ({ onClose, category, onChange, onSave, setCategory }) => {
    const formatBudgetDisplay = (cents) => {
        if (!cents || cents === 0) return '0,00';
        return `${(cents / 100).toString().replace('.', ',')}`;
    };

    const handleBudgetChange = (e) => {
        const inputValue = e.target.value;
        const digits = inputValue.replace(/\D/g, '');
        const cents = digits === '' ? 0 : parseInt(digits, 10);

        const MAX_CENTS = 9999999999999;
        if (cents > MAX_CENTS) {
            return;
        }
        
        setCategory(prev => ({
            ...prev,
            budget: cents
        }));
    };

    const displayBudgetValue = formatBudgetDisplay(category.budget);
        
    return (
        <Modal onClose={onClose}>
            <div className="category-modal">
                <div className="modal-header">
                    <h2>Nova Categoria</h2>
                    <p>Preencha os dados para criar uma nova categoria</p>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Nome da Categoria</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={onChange}
                        maxLength={15}
                        placeholder="Ex: Alimentação"
                        required
                        />
                        <small>{category.name.length}/15</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <input
                        type="text"
                        id="description"
                        name="description"
                        value={category.description}
                        onChange={onChange}
                        maxLength={30}
                        placeholder="Breve descrição"
                        />
                        <small>{category.description.length}/30</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="budget">Orçamento (R$)</label>
                        <input
                            type="text"
                            id="budget"
                            name="budget"
                            value={displayBudgetValue}
                            onChange={handleBudgetChange}
                            placeholder="0,00"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Ícone</label>
                        <div className="icon-selector">
                        {/* You would implement an actual icon selector here */}
                        <button 
                            type="button" 
                            className="icon-option"
                            onClick={() => setCategory({...category, icon: "wallet"})}
                        >
                            🏦
                        </button>
                        <button 
                            type="button" 
                            className="icon-option"
                            onClick={() => setCategory({...category, icon: "food"})}
                        >
                            🍔
                        </button>
                        <button 
                            type="button" 
                            className="icon-option"
                            onClick={() => setCategory({...category, icon: "transport"})}
                        >
                            🚗
                        </button>
                        {/* Add more icon options */}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="color">Cor</label>
                        <input
                        type="color"
                        id="color"
                        name="color"
                        value={category.color}
                        onChange={onChange}
                        />
                    </div>
                </div>
                
                <div className="modal-actions">
                    <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={onClose}
                    >
                    Cancelar
                    </button>
                    <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={onSave}
                    >
                    Criar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CategoryModal;