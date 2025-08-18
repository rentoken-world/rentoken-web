// OwnerProjectList.js
// 左侧“我拥有的项目”列表
(function(global){
function OwnerProjectList(props) {
  const { projects, selectedId, onSelect } = props;
  return React.createElement('div', { className: 'project-list-panel' },
    React.createElement('div', { className: 'project-list-header' },
      React.createElement('span', { style: { fontWeight: 600, fontSize: '1.08rem' } }, '我的项目')
    ),
    React.createElement('ul', { className: 'project-list' },
      projects.length === 0 ?
        React.createElement('li', { className: 'empty' }, '暂无项目') :
        projects.map(p =>
          React.createElement('li', {
            key: p.id,
            className: 'project-item' + (selectedId === p.id ? ' selected' : ''),
            onClick: () => onSelect(p.id)
          },
            React.createElement('div', { className: 'project-title' }, p.name),
            React.createElement('div', { className: 'project-address' }, p.address.slice(0,8)+'...'+p.address.slice(-6))
          )
        )
    )
  );
}
global.OwnerProjectList = OwnerProjectList;
})(typeof window !== 'undefined' ? window : globalThis);
