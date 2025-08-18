// 通用表单输入组件 Input.js
function Input(props) {
  return (
    React.createElement('input', {
      className: 'ui-input' + (props.className ? ' ' + props.className : ''),
      type: props.type || 'text',
      id: props.id,
      min: props.min,
      max: props.max,
      step: props.step,
      defaultValue: props.defaultValue,
      value: props.value,
      onChange: props.onChange,
      placeholder: props.placeholder
    })
  );
}
window.Input = Input;
