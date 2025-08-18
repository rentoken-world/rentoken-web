// React组件：InvestorPanel.js

function InvestorPanel(props) {
  return (
    React.createElement('section', { id: 'investor', className: 'tab-panel' + (props.active ? ' active' : '') },
      React.createElement('h2', null, 'Investor'),
      React.createElement('div', { className: 'investor-grid' },
        React.createElement('div', { className: 'investor-col left' },
          React.createElement(window.Card, null,
            React.createElement('h3', null, 'Token收益K线'),
            React.createElement(window.KLineChart, { data: window.tokenYieldData }),
            React.createElement('div', { className: 'chart-labels' },
              React.createElement('span', { style: { color: '#6a5cff', marginRight: 12 } }, '蓝色=阳线'),
              React.createElement('span', { style: { color: '#ff4d4f' } }, '红色=阴线')
            )
          )
        ),
        React.createElement('div', { className: 'investor-col right' },
          React.createElement(window.Card, null,
            React.createElement('h3', null, '预期收益计算器'),
            React.createElement('form', {
              className: 'calc-form',
              style: { display: 'flex', flexWrap: 'wrap', gap: '12px 18px', alignItems: 'flex-end', marginBottom: 0 },
              onSubmit: e => { e.preventDefault(); window.calcYield(); }
            },
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: '1 1 180px', minWidth: 0 } },
                React.createElement('label', { style: { fontWeight: 500, marginBottom: 4 } }, '投入金额(USDT)'),
                React.createElement(window.Input, { type: 'number', min: 0, step: 0.01, id: 'invest-amount', defaultValue: 1000, style: { width: '100%' } })
              ),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: '1 1 180px', minWidth: 0 } },
                React.createElement('label', { style: { fontWeight: 500, marginBottom: 4 } }, '年化收益率(%)'),
                React.createElement(window.Input, { type: 'number', min: 0, max: 100, step: 0.01, id: 'apy', defaultValue: 8, style: { width: '100%' } })
              ),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: '1 1 180px', minWidth: 0 } },
                React.createElement('label', { style: { fontWeight: 500, marginBottom: 4 } }, '持有天数'),
                React.createElement(window.Input, { type: 'number', min: 1, max: 365, id: 'days', defaultValue: 30, style: { width: '100%' } })
              ),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
                React.createElement(window.Button, { type: 'button', onClick: window.calcYield, style: { minWidth: 100, marginTop: 8 } }, '计算')
              )
            ),
            React.createElement('div', {
              id: 'yield-result',
              className: 'result',
              style: { marginTop: 12, fontWeight: 600, fontSize: '1.12rem', color: '#ffe066', minHeight: 24 }
            })
          ),
          React.createElement(window.Card, null,
            React.createElement('h3', null, '风险评估'),
            React.createElement('ul', { className: 'risk-list' },
              React.createElement('li', null, '二级市场风险：价格波动、流动性风险'),
              React.createElement('li', null, '一级市场风险：底层资产违约、收益不达预期')
            )
          ),
          React.createElement(window.Card, { className: 'actions' },
            React.createElement(window.Button, { className: 'buy-btn' }, '买入'),
            React.createElement(window.Button, { className: 'sell-btn' }, '卖出')
          )
        )
      )
    )
  );
}

window.InvestorPanel = InvestorPanel;
