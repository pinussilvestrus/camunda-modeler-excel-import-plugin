module.exports = function(electronApp, menuState) {
  return [
    {
      label: 'Open excel sheet',
      accelerator: 'CommandOrControl+e',
      enabled: function() {
        return true;
      },
      action: function() {
        electronApp.emit('menu:action', 'emit-event', {
          type: 'excel-import-plugin:import'
        });
      }
    }
  ];
};