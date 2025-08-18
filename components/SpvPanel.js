// React组件：SpvPanel.js
function SpvPanel(props) {
  return (
    React.createElement('section', { id: 'spv', className: 'tab-panel' + (props.active ? ' active' : '') },
      React.createElement('h2', null, 'SPV'),
      React.createElement('ul', null,
        React.createElement('li', null, '总合同量、总数、完成度'),
        React.createElement('li', null, '合同详情'),
        React.createElement('li', null, '合同履约进度')
      )
    )
  );
}

window.SpvPanel = SpvPanel;
