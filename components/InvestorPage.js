// InvestorPage.js
// Investor主页面骨架，双栏布局+mock数据
(function(global){
function mockProjects(address) {
  return [
    {
      id: '1',
      name: '上海静安公寓',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      owner: 'Alice',
      assetStatus: '在租',
      status: 'fundraising',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 1200 },
        { month: '2025-06', amount: 1200 }
      ],
      participants: [address, '0xabc']
    },
    {
      id: '2',
      name: '深圳南山公寓',
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      owner: 'Bob',
      assetStatus: '空置',
      status: 'running',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 900 },
        { month: '2025-06', amount: 900 }
      ],
      participants: ['0xabc']
    },
    {
      id: '3',
      name: '北京朝阳写字楼',
      address: '0xbbbcccccccccccccccccccccccccccccccccccc',
      owner: 'Carol',
      assetStatus: '在租',
      status: 'finish',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 3000 },
        { month: '2025-06', amount: 3000 },
        { month: '2025-05', amount: 3000 }
      ],
      participants: [address]
    },
    {
      id: '4',
      name: '杭州滨江公寓',
      address: '0xdddddddddddddddddddddddddddddddddddddddd',
      owner: 'David',
      assetStatus: '在租',
      status: 'fundraising',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 800 },
        { month: '2025-06', amount: 800 }
      ],
      participants: []
    },
    {
      id: '5',
      name: '广州天河别墅',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      owner: 'Eve',
      assetStatus: '空置',
      status: 'running',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 5000 },
        { month: '2025-06', amount: 5000 },
        { month: '2025-05', amount: 5000 }
      ],
      participants: ['0xabc', address]
    },
    {
      id: '6',
      name: '成都高新公寓',
      address: '0xffffffffffffffffffffffffffffffffffffffff',
      owner: 'Frank',
      assetStatus: '在租',
      status: 'fundraising',
      yieldData: window.tokenYieldData,
      rentFlows: [
        { month: '2025-07', amount: 1100 },
        { month: '2025-06', amount: 1100 }
      ],
      participants: []
    }
  ];
}
function InvestorPage(props) {
  const [search, setSearch] = React.useState('');
  const [showMine, setShowMine] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678'; // mock
  const allProjects = React.useMemo(() => mockProjects(userAddress), []);
  const filtered = allProjects.filter(p =>
    (!showMine || p.participants.includes(userAddress)) &&
    (p.name.includes(search) || p.address.includes(search))
  );
  const selected = filtered.find(p => p.id === selectedId) || filtered[0];
  React.useEffect(()=>{ if(selected && selected.id!==selectedId) setSelectedId(selected.id); },[filtered]);
  return React.createElement('div', { className: 'investor-main-grid' },
    React.createElement('div', { className: 'investor-main-col left' },
      React.createElement(global.InvestorProjectList, {
        projects: filtered,
        search,
        onSearch: setSearch,
        onSelect: setSelectedId,
        selectedId,
        onFilterMine: ()=>setShowMine(v=>!v),
        showMine
      })
    ),
    React.createElement('div', { className: 'investor-main-col right' },
      React.createElement(global.InvestorProjectDetail, {
        project: selected,
        onBuy: ()=>alert('买入功能开发中'),
        onWithdraw: ()=>alert('提取功能开发中')
      })
    )
  );
}
global.InvestorPage = InvestorPage;
})(typeof window !== 'undefined' ? window : globalThis);
