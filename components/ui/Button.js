// 通用按钮组件 Button.js
function Button(props) {
  const btnClass = 'ui-btn' + (props.secondary ? ' secondary' : '') + (props.className ? ' ' + props.className : '');
  return (
    React.createElement('button', {
      className: btnClass,
      type: props.type || 'button',
      onClick: props.onClick
    }, props.children)
  );
}
window.Button = Button;
