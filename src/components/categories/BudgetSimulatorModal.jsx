import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaPlus, FaTrash, FaPercent, FaDollarSign } from 'react-icons/fa';
import FormModal from '../modals/FormModal';
import { Icon, iconMap } from '../icons';
import { CATEGORY_COLORS } from '../../utils/colors';
import { formatMoneyInput, parseMoneyInputToCents, formatCurrencyFromCents } from '../../utils/money';
import './BudgetSimulatorModal.css';

const AVAILABLE_ICONS = Object.keys(iconMap).filter(
  (k) => !['edit', 'trash', 'creation'].includes(k)
);

function newRow() {
  return {
    id: crypto.randomUUID(),
    name: '',
    color: CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)],
    icon: AVAILABLE_ICONS[Math.floor(Math.random() * AVAILABLE_ICONS.length)],
    mode: 'percent',
    value: '',
  };
}

function safeparse(val) {
  try { return parseMoneyInputToCents(val); } catch { return 0; }
}

function rowToCents(row, incomeCents) {
  if (!row.value) return 0;
  if (row.mode === 'percent') {
    const pct = parseFloat(row.value.replace(',', '.')) || 0;
    return Math.round((pct / 100) * incomeCents);
  }
  return safeparse(row.value);
}

function BudgetSimulatorModal({ onClose, onSave }) {
  const [incomeInput, setIncomeInput] = useState('');
  const [rows, setRows] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pickerRefs = useRef({});

  const incomeCents = incomeInput ? safeparse(incomeInput) : 0;
  const totalCents  = rows.reduce((s, r) => s + rowToCents(r, incomeCents), 0);
  const totalPct    = incomeCents > 0 ? (totalCents / incomeCents) * 100 : 0;
  const isOver      = totalCents > incomeCents && incomeCents > 0;
  const isBalanced  = incomeCents > 0 && Math.abs(totalCents - incomeCents) < 1;

  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openDropdown]);

  const handleIncomeChange = (e) => setIncomeInput(formatMoneyInput(e.target.value));

  const setField = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handleValueChange = (id, raw, mode) => {
    if (mode === 'percent') {
      const cleaned = raw.replace(/[^\d,\.]/g, '').slice(0, 6);
      setField(id, 'value', cleaned);
    } else {
      setField(id, 'value', formatMoneyInput(raw));
    }
  };

  const handleModeChange = (id, newMode) =>
    setRows((prev) => prev.map((r) =>
      r.id === id ? { ...r, mode: newMode, value: '' } : r
    ));

  const toggleDropdown = (rowId, type) => {
    setOpenDropdown((prev) => {
      if (prev?.rowId === rowId && prev?.type === type) return null;
      const el = pickerRefs.current[`${rowId}-${type}`];
      const rect = el?.getBoundingClientRect();
      if (!rect) return null;
      return { rowId, type, top: rect.bottom + 6, left: rect.left };
    });
  };

  const handleIconSelect  = (rowId, icon)  => { setField(rowId, 'icon', icon);  setOpenDropdown(null); };
  const handleColorSelect = (rowId, color) => { setField(rowId, 'color', color); setOpenDropdown(null); };

  const handleAddRow    = () => setRows((prev) => [...prev, newRow()]);
  const handleRemoveRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = () => {
    const cats = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        color: r.color,
        icon: r.icon,
        budgetAmount: rowToCents(r, incomeCents),
        isActive: true,
      }));
    if (cats.length === 0) return;
    onSave(cats);
  };

  const namedRows = rows.filter((r) => r.name.trim()).length;
  const canSave = rows.length > 0 && incomeCents > 0 && namedRows > 0 && !isOver;

  return (
    <FormModal onClose={onClose}>
      <div className="bsm">
        <div className="bsm__header">
          <h2>Simulador de Or&#231;amento</h2>
          <p>Defina sua renda e distribua entre categorias</p>
        </div>

        {/* Income */}
        <div className="bsm__income-row">
          <label htmlFor="bsm-income">Renda Total (R$)</label>
          <input
            id="bsm-income"
            type="text"
            className="bsm__input bsm__input--income"
            value={incomeInput}
            onChange={handleIncomeChange}
            placeholder="0,00"
          />
        </div>

        {/* Rows */}
        <div className="bsm__rows">
          {rows.length === 0 && (
            <div className="bsm__empty">
              Nenhuma categoria adicionada. Clique em "Adicionar categoria" para come&#231;ar.
            </div>
          )}
          {rows.map((row) => {
            const cents = rowToCents(row, incomeCents);

            return (
              <div key={row.id} className="bsm__row">
                {/* Name */}
                <input
                  type="text"
                  className="bsm__input bsm__input--name"
                  value={row.name}
                  onChange={(e) => setField(row.id, 'name', e.target.value)}
                  maxLength={20}
                  placeholder="Nome da Categoria"
                />

                {/* Icon picker */}
                <div className="bsm__picker-wrap">
                  <button
                    ref={(el) => { pickerRefs.current[`${row.id}-icon`] = el; }}
                    type="button"
                    className="bsm__picker-trigger bsm__picker-trigger--icon"
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(row.id, 'icon'); }}
                    title="Selecionar icone"
                  >
                    <Icon icon={row.icon} fontSize="13" />
                  </button>
                  {openDropdown?.rowId === row.id && openDropdown?.type === 'icon' && createPortal(
                    <div
                      className="bsm__dropdown"
                      style={{ position: 'fixed', top: openDropdown.top, left: openDropdown.left }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {AVAILABLE_ICONS.map((k) => (
                        <button
                          key={k}
                          type="button"
                          className={`bsm__dropdown-item${row.icon === k ? ' bsm__dropdown-item--selected' : ''}`}
                          onClick={() => handleIconSelect(row.id, k)}
                          title={k}
                        >
                          <Icon icon={k} fontSize="13" />
                        </button>
                      ))}
                    </div>,
                    document.body
                  )}
                </div>

                {/* Color picker */}
                <div className="bsm__picker-wrap">
                  <button
                    ref={(el) => { pickerRefs.current[`${row.id}-color`] = el; }}
                    type="button"
                    className="bsm__picker-trigger bsm__picker-trigger--color"
                    style={{ background: row.color, borderColor: 'transparent' }}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(row.id, 'color'); }}
                    title="Selecionar cor"
                  />
                  {openDropdown?.rowId === row.id && openDropdown?.type === 'color' && createPortal(
                    <div
                      className="bsm__dropdown bsm__dropdown--color"
                      style={{ position: 'fixed', top: openDropdown.top, left: openDropdown.left }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {CATEGORY_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`bsm__color-dot${row.color === c ? ' bsm__color-dot--selected' : ''}`}
                          style={{ background: c }}
                          onClick={() => handleColorSelect(row.id, c)}
                          title={c}
                        />
                      ))}
                    </div>,
                    document.body
                  )}
                </div>

                {/* Type toggle */}
                <div className="bsm__type-toggle">
                  <button
                    type="button"
                    className={`bsm__type-btn${row.mode === 'percent' ? ' bsm__type-btn--active' : ''}`}
                    onClick={() => handleModeChange(row.id, 'percent')}
                    title="Percentual"
                  >
                    <FaPercent size={9} />
                  </button>
                  <button
                    type="button"
                    className={`bsm__type-btn${row.mode === 'fixed' ? ' bsm__type-btn--active' : ''}`}
                    onClick={() => handleModeChange(row.id, 'fixed')}
                    title="Valor Fixo"
                  >
                    <FaDollarSign size={9} />
                  </button>
                </div>

                {/* Value input + calculated badge */}
                <div className="bsm__value-group">
                  <input
                    type="text"
                    className="bsm__input bsm__input--value"
                    value={row.value}
                    onChange={(e) => handleValueChange(row.id, e.target.value, row.mode)}
                    placeholder={row.mode === 'percent' ? '0' : '0,00'}
                  />
                  {row.mode === 'percent' && cents > 0 && (
                    <span className="bsm__calc-badge">
                      R$ {formatCurrencyFromCents(cents)}
                    </span>
                  )}
                </div>

                {/* Delete */}
                <button
                  type="button"
                  className="bsm__remove-btn"
                  onClick={() => handleRemoveRow(row.id)}
                  title="Remover"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add row */}
        <button type="button" className="bsm__add-row-btn" onClick={handleAddRow}>
          <FaPlus size={11} /> Adicionar categoria
        </button>

        {/* Progress bar */}
        {incomeCents > 0 && (
          <div className="bsm__progress-wrap">
            <div className="bsm__progress-info">
              <span className="bsm__progress-text">
                Alocado: R$ {formatCurrencyFromCents(totalCents)}
              </span>
              <span className={`bsm__progress-text${isOver ? ' bsm__progress-text--over' : isBalanced ? ' bsm__progress-text--ok' : ''}`}>
                {totalPct.toFixed(1)}%{isOver && ' — excede!'}{isBalanced && ' ✓'}
              </span>
            </div>
            <div className="bsm__progress">
              <div
                className={`bsm__progress-fill${isOver ? ' bsm__progress-fill--over' : isBalanced ? ' bsm__progress-fill--ok' : ''}`}
                style={{ width: `${Math.min(totalPct, 100)}%` }}
              />
            </div>
            {isOver && (
              <p className="bsm__progress-warning">
                Voce planejou mais do que sua renda disponivel!
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bsm__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!canSave}>
            Criar {namedRows} Categoria{namedRows !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </FormModal>
  );
}

export default BudgetSimulatorModal;
