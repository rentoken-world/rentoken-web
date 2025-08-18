// React组件：OwnerPanel.js
function OwnerPanel(props) {
  return (
    React.createElement('section', { id: 'owner', className: 'tab-panel' + (props.active ? ' active' : '') },
      React.createElement('h2', null, 'Owner'),
      React.createElement('ul', null,
        React.createElement('li', null, '查看已发放收益、预期收益等'),
        React.createElement('li', null, '计算当前收益率、总收益等'),
        React.createElement('li', null, '查看合同完成进度')
      )
    )
  );
}

window.OwnerPanel = OwnerPanel;
