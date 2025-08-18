// InvestorProjectList.js
// 左侧项目列表+搜索+我的按钮
(function(global){
function InvestorProjectList(props) {
  const { projects, search, onSearch, onSelect, selectedId, onFilterMine, showMine } = props;
  return React.createElement('div', { className: 'project-list-panel' },
    React.createElement('div', { className: 'project-list-header' },
      React.createElement('input', {
        className: 'ui-input project-search',
        placeholder: '搜索项目/合约',
        value: search,
        onChange: e => onSearch(e.target.value)
      }),
      React.createElement('button', {
        className: 'ui-btn project-mine-btn' + (showMine ? ' active' : ''),
        onClick: onFilterMine
      }, '我的')
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
global.InvestorProjectList = InvestorProjectList;
})(typeof window !== 'undefined' ? window : globalThis);
