import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaPlus, FaTrash, FaDollarSign, FaPercent, FaCheck } from 'react-icons/fa';
import { FaMoneyBillWave } from 'react-icons/fa6';
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
  const totalCents = rows.reduce((s, r) => s + rowToCents(r, incomeCents), 0);
  const remainingCents = incomeCents - totalCents;
  const totalPct = incomeCents > 0 ? (totalCents / incomeCents) * 100 : 0;
  const isOver = totalCents > incomeCents && incomeCents > 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

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

  const handleIconSelect = (rowId, icon) => { setField(rowId, 'icon', icon); setOpenDropdown(null); };
  const handleColorSelect = (rowId, color) => { setField(rowId, 'color', color); setOpenDropdown(null); };

  const handleAddRow = () => setRows((prev) => [...prev, newRow()]);
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
    <div className="bsm-overlay" onClick={onClose}>
      <div className="bsm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bsm__header">
          <div className="bsm__header-icon">
            <FaMoneyBillWave size={18} />
          </div>
          <div className="bsm__header-text">
            <h2>Simulador de Orçamento</h2>
            <p>Divida sua renda em categorias rapidamente</p>
          </div>
          <button type="button" className="bsm__close" onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="bsm__body">
          {/* Income card */}
          <div className="bsm__income-card">
            <label htmlFor="bsm-income">Qual é a sua renda total a ser dividida?</label>
            <div className="bsm__income-input-wrap">
              <span className="bsm__income-prefix">R$</span>
              <input
                id="bsm-income"
                type="text"
                className="bsm__income-input"
                value={incomeInput}
                onChange={handleIncomeChange}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Categories section */}
          <div className="bsm__section-header">
            <h3>Suas Categorias</h3>
            <button type="button" className="bsm__add-link" onClick={handleAddRow}>
              <FaPlus size={10} /> Adicionar
            </button>
          </div>

          <div className="bsm__rows">
            {rows.length === 0 && (
              <div className="bsm__empty">
                Nenhuma categoria adicionada. Clique em "+ Adicionar" para começar.
              </div>
            )}
            {rows.map((row) => {
              const cents = rowToCents(row, incomeCents);
              const rowPct = incomeCents > 0 ? ((cents / incomeCents) * 100).toFixed(0) : 0;

              return (
                <div key={row.id} className="bsm__row">
                  {/* Color picker */}
                  <button
                    ref={(el) => { pickerRefs.current[`${row.id}-color`] = el; }}
                    type="button"
                    className="bsm__color-circle"
                    style={{ background: row.color }}
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
                        />
                      ))}
                    </div>,
                    document.body
                  )}

                  {/* Icon picker */}
                  <button
                    ref={(el) => { pickerRefs.current[`${row.id}-icon`] = el; }}
                    type="button"
                    className="bsm__icon-btn"
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(row.id, 'icon'); }}
                    title="Selecionar ícone"
                  >
                    <Icon icon={row.icon} fontSize="14" />
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

                  {/* Name */}
                  <input
                    type="text"
                    className="bsm__name-input"
                    value={row.name}
                    onChange={(e) => setField(row.id, 'name', e.target.value)}
                    maxLength={20}
                    placeholder="Nome da Categoria"
                  />

                  {/* Type toggle */}
                  <div className="bsm__toggle">
                    <button
                      type="button"
                      className={`bsm__toggle-btn${row.mode === 'fixed' ? ' bsm__toggle-btn--active' : ''}`}
                      onClick={() => handleModeChange(row.id, 'fixed')}
                    >
                      $
                    </button>
                    <button
                      type="button"
                      className={`bsm__toggle-btn${row.mode === 'percent' ? ' bsm__toggle-btn--active' : ''}`}
                      onClick={() => handleModeChange(row.id, 'percent')}
                    >
                      %
                    </button>
                  </div>

                  {/* Value */}
                  <input
                    type="text"
                    className="bsm__value-input"
                    value={row.value}
                    onChange={(e) => handleValueChange(row.id, e.target.value, row.mode)}
                    placeholder={row.mode === 'percent' ? '0' : '0,00'}
                  />

                  {/* Calculated display */}
                  <div className="bsm__calc">
                    <span className="bsm__calc-amount">R$ {formatCurrencyFromCents(cents)}</span>
                    {row.mode === 'percent' && <span className="bsm__calc-pct">{rowPct}%</span>}
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    className="bsm__delete-btn"
                    onClick={() => handleRemoveRow(row.id)}
                    title="Remover"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          {incomeCents > 0 && (
            <div className="bsm__progress-section">
              <div className="bsm__progress-labels">
                <span>Alocado: R$ {formatCurrencyFromCents(totalCents)}</span>
                <span className={isOver ? 'bsm__progress-labels--over' : ''}>
                  Restante: R$ {formatCurrencyFromCents(Math.max(remainingCents, 0))}
                </span>
              </div>
              <div className="bsm__progress-bar">
                <div
                  className={`bsm__progress-fill${isOver ? ' bsm__progress-fill--over' : ''}`}
                  style={{ width: `${Math.min(totalPct, 100)}%` }}
                />
              </div>
              {isOver && (
                <p className="bsm__progress-warning">
                  Você planejou mais do que sua renda disponível!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bsm__actions">
          <button type="button" className="bsm__btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="bsm__btn-save" onClick={handleSubmit} disabled={!canSave}>
            <FaCheck size={12} /> Criar {namedRows} Categoria{namedRows !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetSimulatorModal;
