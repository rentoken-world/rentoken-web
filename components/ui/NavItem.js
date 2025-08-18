// NavItem 组件，专为导航tab设计，支持active状态
function NavItem(props) {
  return React.createElement(
    'button',
    {
      className: 'tab-btn' + (props.active ? ' active' : ''),
      type: 'button',
      onClick: props.onClick,
      'data-tab': props['data-tab'],
      style: props.style || undefined
    },
    props.children
  );
}
window.NavItem = NavItem;
