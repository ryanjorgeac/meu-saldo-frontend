export default function TextInput({ 
  type = "text", 
  id, 
  label, 
  placeholder, 
  value, 
  onChange,
  onBlur,
  required = true,
  error = null
}) {
  return (
    <div className='auth-form-group'>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={error ? 'auth-input-error' : ''}
      />
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  );
}