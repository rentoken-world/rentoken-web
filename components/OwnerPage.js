// OwnerPage.js
// Owner主页面骨架，双栏布局+mock数据
(function(global){
function mockOwnerProjects(address) {
  return [
    {
      id: '1',
      name: '上海静安公寓',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      minFund: 10000,
      maxFund: 20000,
      currentFund: 15000,
      myToken: 500,
      myYield: 1200
    },
    {
      id: '2',
      name: '深圳南山公寓',
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      minFund: 8000,
      maxFund: 18000,
      currentFund: 8000,
      myToken: 200,
      myYield: 300
    }
  ];
}
function OwnerPage(props) {
  const [selectedId, setSelectedId] = React.useState(null);
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678'; // mock
  const allProjects = React.useMemo(() => mockOwnerProjects(userAddress), []);
  const selected = allProjects.find(p => p.id === selectedId) || allProjects[0];
  React.useEffect(()=>{ if(selected && selected.id!==selectedId) setSelectedId(selected.id); },[allProjects]);
  return React.createElement('div', { className: 'investor-main-grid' },
    React.createElement('div', { className: 'investor-main-col left' },
      React.createElement(global.OwnerProjectList, {
        projects: allProjects,
        selectedId,
        onSelect: setSelectedId
      })
    ),
    React.createElement('div', { className: 'investor-main-col right' },
      React.createElement(global.OwnerProjectDetail, {
        project: selected,
        onWithdraw: ()=>alert('提取功能开发中')
      })
    )
  );
}
global.OwnerPage = OwnerPage;
})(typeof window !== 'undefined' ? window : globalThis);
