// InvestorProjectDetail.js
// 右侧项目详情区
(function(global){
function InvestorProjectDetail(props) {
  const { project, onBuy, onWithdraw } = props;
  if (!project) return React.createElement('div', { className: 'project-detail-empty' }, '请选择左侧项目');
  // 合约状态样式
  const statusMap = {
    fundraising: { text: '募集中', color: '#00e1ff' },
    running: { text: '运行中', color: '#6c47ff' },
    finish: { text: '已结束', color: '#b983ff' }
  };
  const status = statusMap[project.status] || { text: project.status, color: '#fff' };
  return React.createElement('div', { className: 'project-detail-panel' },
    React.createElement('div', { className: 'project-detail-header' },
      React.createElement('div', { className: 'project-title' }, project.name),
      React.createElement('span', { className: 'project-status', style: { color: status.color, fontWeight: 700, marginLeft: 12 } }, status.text)
    ),
    React.createElement('div', { className: 'project-meta' },
      React.createElement('div', null, '房东: ', project.owner),
      React.createElement('div', null, '房产状态: ', project.assetStatus),
      React.createElement('div', null, '合约地址: ', project.address)
    ),
    React.createElement('div', { className: 'project-actions' },
      project.status === 'fundraising' && React.createElement('button', { className: 'ui-btn', onClick: onBuy }, '买入'),
      (project.status === 'running' || project.status === 'finish') && React.createElement('button', { className: 'ui-btn secondary', onClick: onWithdraw }, '提取USDC')
    ),
    React.createElement('div', { className: 'project-yield' },
      React.createElement('h4', null, '收益曲线'),
      React.createElement(window.KLineChart, { data: project.yieldData })
    ),
    React.createElement('div', { className: 'project-rentflow' },
      React.createElement('h4', null, '租金入账记录'),
      React.createElement('table', { className: 'rentflow-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, '月份'),
            React.createElement('th', null, '金额(USDC)')
          )
        ),
        React.createElement('tbody', null,
          (project.rentFlows||[]).map((r,i) =>
            React.createElement('tr', { key: i },
              React.createElement('td', null, r.month),
              React.createElement('td', null, r.amount)
            )
          )
        )
      )
    )
  );
}
global.InvestorProjectDetail = InvestorProjectDetail;
})(typeof window !== 'undefined' ? window : globalThis);
