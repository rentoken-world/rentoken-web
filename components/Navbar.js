/*
 * @Author: Mr.Car
 * @Date: 2025-08-18 17:25:08
 */
// React组件：Navbar.js

function Navbar() {
  const { activeTab, setActiveTab } = arguments[0] || {};
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 700);
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 700);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const tabs = [
    { key: 'investor', label: 'Investor' },
    // { key: 'spv', label: 'SPV' },
    { key: 'owner', label: 'Owner' }
  ];
  return (
    React.createElement('nav', { className: 'navbar', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { className: 'nav-logo' },
        React.createElement('img', { src: 'logo.jpg', alt: 'rentoken.world logo' }),
        React.createElement('span', null, 'rentoken.world')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 18 } },
        isMobile ? (
          React.createElement('div', { className: 'nav-tabs' },
            React.createElement('select', {
              className: 'tab-select',
              value: activeTab,
              onChange: e => setActiveTab(e.target.value),
              style: { fontSize: '1.08rem', borderRadius: 8, padding: '6px 16px', minWidth: 120 }
            },
              tabs.map(tab =>
                React.createElement('option', { value: tab.key, key: tab.key }, tab.label)
              )
            )
          )
        ) : (
          React.createElement('div', { className: 'nav-tabs' },
            tabs.map(tab =>
              React.createElement(window.Button, {
                className: 'tab-btn' + (activeTab === tab.key ? ' active' : ''),
                'data-tab': tab.key,
                key: tab.key,
                onClick: () => setActiveTab(tab.key),
                type: 'button'
              }, tab.label)
            )
          )
        ),
        React.createElement('button', {
          className: 'wallet-btn',
          style: {
            marginLeft: 18,
            padding: '10px 28px',
            borderRadius: 16,
            background: 'linear-gradient(90deg,#00e1ff 0%,#6c47ff 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: '1.08rem',
            boxShadow: '0 2px 12px 0 #00e1ff33',
            cursor: 'pointer',
            transition: 'filter 0.18s',
          },
          onClick: () => alert('连接钱包功能开发中')
        }, '连接钱包')
      )
    )
  );
}

window.Navbar = Navbar;
