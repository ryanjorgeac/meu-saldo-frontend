import DatePicker, { registerLocale } from "react-datepicker";
import { getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css";

registerLocale("pt-BR", ptBR);

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const YEARS = Array.from(
  { length: getYear(new Date()) - 1989 },
  (_, index) => 1990 + index
);

function CustomHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) {
  return (
    <div className="datepicker-header">
      <button
        type="button"
        className="datepicker-nav-button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        {"<"}
      </button>

      <select
        className="datepicker-select"
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(Number(value))}
      >
        {YEARS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className="datepicker-select"
        value={MONTHS[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(MONTHS.indexOf(value))}
      >
        {MONTHS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="datepicker-nav-button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        {">"}
      </button>
    </div>
  );
}

function DateInput({
  name,
  value,
  onChange,
  placeholder,
  className = "",
  minDate,
  maxDate,
  ...props
}) {
  const selectedDate = value ? new Date(value) : null;

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => {
        onChange({
          target: {
            name,
            value: date ? date.toISOString() : "",
          },
        });
      }}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
      locale="pt-BR"
      calendarStartDay={0}
      renderCustomHeader={(headerProps) => <CustomHeader {...headerProps} />}
      className={`date-input ${className}`}
      minDate={minDate ? new Date(minDate) : undefined}
      maxDate={maxDate ? new Date(maxDate) : undefined}
      isClearable
      {...props}
    />
  );
}

export default DateInput;