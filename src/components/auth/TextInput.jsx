export default function TextInput({ 
  type = "text", 
  id, 
  label, 
  placeholder, 
  value, 
  onChange,
  required = true,
  error = null
}) {
  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'input-error' : ''}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}