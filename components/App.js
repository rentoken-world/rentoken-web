// React主入口：App.js
function App() {
  const [activeTab, setActiveTab] = React.useState('investor');
  React.useEffect(() => {
    window.activeTab = activeTab;
    window.setActiveTab = setActiveTab;
    setTimeout(() => { if (activeTab === 'investor' && window.drawYieldChart) window.drawYieldChart(); }, 0);
  }, [activeTab]);
  return (
    React.createElement(React.Fragment, null,
      React.createElement(window.Navbar),
      React.createElement('main', { className: 'tab-content' },
        React.createElement(window.InvestorPanel, { active: activeTab === 'investor' }),
        React.createElement(window.SpvPanel, { active: activeTab === 'spv' }),
        React.createElement(window.OwnerPanel, { active: activeTab === 'owner' })
      ),
      React.createElement(window.Footer)
    )
  );
}

window.App = App;
