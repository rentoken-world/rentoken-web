// 通用卡片组件 Card.js
function Card(props) {
  return (
    React.createElement('div', { className: 'ui-card' + (props.className ? ' ' + props.className : '') },
      props.children
    )
  );
}
window.Card = Card;
