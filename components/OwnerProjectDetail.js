// OwnerProjectDetail.js
// 右侧“我拥有的项目”详情
(function(global){
function OwnerProjectDetail(props) {
  const { project, onWithdraw } = props;
  if (!project) return React.createElement('div', { className: 'project-detail-empty' }, '请选择左侧项目');
  return React.createElement('div', { className: 'project-detail-panel' },
    React.createElement('div', { className: 'project-detail-header' },
      React.createElement('div', { className: 'project-title' }, project.name)
    ),
    React.createElement('div', { className: 'project-meta' },
      React.createElement('div', null, '最低启动资金: ', project.minFund, ' USDC'),
      React.createElement('div', null, '最大启动资金: ', project.maxFund, ' USDC'),
      React.createElement('div', null, '合约地址: ', project.address)
    ),
    React.createElement('div', { className: 'owner-progress-bar' },
      React.createElement('div', { className: 'owner-progress-bg' },
        React.createElement('div', {
          className: 'owner-progress-fg',
          style: { width: (project.currentFund / project.maxFund * 100) + '%' }
        })
      ),
      React.createElement('div', { className: 'owner-progress-label' },
        '已筹集: ', project.currentFund, ' / ', project.maxFund, ' USDC'
      )
    ),
    React.createElement('div', { className: 'owner-holdings' },
      React.createElement('div', null, '当前持有rentoken: ', project.myToken),
      React.createElement('div', null, '当前可提收益: ', project.myYield, ' USDC')
    ),
    React.createElement('div', { className: 'project-actions' },
      React.createElement('button', { className: 'ui-btn secondary', onClick: onWithdraw }, '提取收益')
    )
  );
}
global.OwnerProjectDetail = OwnerProjectDetail;
})(typeof window !== 'undefined' ? window : globalThis);
