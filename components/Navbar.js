// React组件：Navbar.js

function Navbar() {
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
    { key: 'spv', label: 'SPV' },
    { key: 'owner', label: 'Owner' }
  ];
    return (
      React.createElement('nav', { className: 'navbar' },
        React.createElement('div', { className: 'nav-logo' },
          React.createElement('img', { src: 'logo.jpg', alt: 'rentoken.world logo' }),
          React.createElement('span', null, 'rentoken.world')
        ),
        isMobile ? (
          React.createElement('div', { className: 'nav-tabs' },
            React.createElement('select', {
              className: 'tab-select',
              value: window.activeTab,
              onChange: e => window.setActiveTab(e.target.value),
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
                className: 'tab-btn' + (window.activeTab === tab.key ? ' active' : ''),
                'data-tab': tab.key,
                key: tab.key,
                onClick: () => window.setActiveTab(tab.key),
                type: 'button'
              }, tab.label)
            )
          )
        )
      )
    );
}

window.Navbar = Navbar;
