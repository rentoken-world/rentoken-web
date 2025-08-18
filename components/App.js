/*
 * @Author: Mr.Car
 * @Date: 2025-08-18 17:25:43
 */
// React主入口：App.js
function App() {
  const [activeTab, setActiveTab] = React.useState('investor');
  React.useEffect(() => {
    window.activeTab = activeTab;
    window.setActiveTab = setActiveTab;
    setTimeout(() => { if (activeTab === 'investor' && window.drawYieldChart) window.drawYieldChart(); }, 0);
  }, [activeTab]);
  let mainContent = null;
  if (activeTab === 'investor') mainContent = React.createElement(window.InvestorPage, { active: true });
  else if (activeTab === 'owner') mainContent = React.createElement(window.OwnerPage, { active: true });
  return (
    React.createElement(React.Fragment, null,
      React.createElement(window.Navbar, { activeTab, setActiveTab }),
      React.createElement('main', { className: 'tab-content' },
        mainContent
      ),
      React.createElement(window.Footer)
    )
  );
}

window.App = App;
