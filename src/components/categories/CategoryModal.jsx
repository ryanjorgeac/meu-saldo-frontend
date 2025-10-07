import Modal from '../common/Modal';
import './CategoryModal.css';

const CategoryModal = ({ onClose, category, onChange, onSave, setCategory }) => {
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
                        <label htmlFor="type">Tipo</label>
                        <select
                        id="type"
                        name="type"
                        value={category.type}
                        onChange={onChange}
                        >
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="placeholder">Valor Padrão</label>
                        <input
                        type="number"
                        id="placeholder"
                        name="placeholder"
                        value={category.placeholder}
                        onChange={onChange}
                        placeholder="0.00"
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