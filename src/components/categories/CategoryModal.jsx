import FormModal from '../modals/FormModal';
import { formatMoneyInput } from '../../utils/money'
import { Icon, iconMap } from '../icons';
import { CATEGORY_COLORS } from '../../utils/colors';
import './CategoryModal.css';

const CategoryModal = ({ onClose, category, onChange, onSave, setCategory, isEditing = false }) => {
    const getAvailableIcons = () => {
        const excludedIcons = ['edit', 'trash', 'creation'];
        return Object.keys(iconMap).filter(icon => !excludedIcons.includes(icon));
    };

    const handleBudgetChange = (e) => {
        const formattedValue = formatMoneyInput(e.target.value);
        const digits = formattedValue.replace(/\D/g, '');
        const MAX_CENTS_LENGTH = 13;

        if (digits.length > MAX_CENTS_LENGTH) {
            return;
        }

        setCategory(prev => ({
            ...prev,
            budgetAmountInput: formattedValue
        }));
    };

    return (
        <FormModal onClose={onClose}>
            <div className="category-modal">
                <div className="category-modal-header">
                    <h2>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                    <p>{isEditing ? 'Altere os dados da categoria' : 'Preencha os dados para criar uma nova categoria'}</p>
                </div>

                <div className="modal-body">
                    <div className="category-form-group">
                        <label htmlFor="name">Nome da Categoria</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={onChange}
                        maxLength={20}
                        placeholder="Ex: Alimentação"
                        required
                        />
                    </div>
                    
                    <div className="category-form-group">
                        <label htmlFor="description">Descrição</label>
                        <input
                        type="text"
                        id="description"
                        name="description"
                        value={category.description}
                        onChange={onChange}
                        maxLength={48}
                        placeholder="Breve descrição"
                        />
                    </div>

                    <div className="category-form-group">
                        <label htmlFor="budgetAmount">Orçamento (R$)</label>
                        <input
                            type="text"
                            id="budgetAmount"
                            name="budgetAmount"
                            value={category.budgetAmountInput}
                            onChange={handleBudgetChange}
                            placeholder={category.budgetAmountDisplay || "0,00"}
                        />
                    </div>

                    <div className="category-form-group">
                        <label>Ícone</label>
                        <div className="icon-selector">
                            {getAvailableIcons().map((iconName) => (
                                <button 
                                    key={iconName}
                                    type="button" 
                                    className={`icon-option ${category.icon === iconName ? 'icon-option--selected' : ''}`}
                                    onClick={() => setCategory({...category, icon: iconName})}
                                >
                                    <Icon icon={iconName} fontSize="22" />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="category-form-group">
                        <label>Cor</label>
                        <div className="color-selector">
                            {CATEGORY_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${category.color === color ? 'color-option--selected' : ''}`}
                                    style={{ background: color }}
                                    onClick={() => setCategory({...category, color})}
                                    title={color}
                                />
                            ))}
                        </div>
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
                    {isEditing ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </div>
        </FormModal>
    );
}

export default CategoryModal;