var parameters = {};
parameters.FullName = "Seyed Ahmad Nabavi Chashmi";
var req = new XMLHttpRequest();
req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/Microsoft.Dynamics.CRM.cr12f_GetCustomers", false);
req.setRequestHeader("OData-MaxVersion", "4.0");
req.setRequestHeader("OData-Version", "4.0");
req.setRequestHeader("Accept", "application/json");
req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
req.onreadystatechange = function () {
  if (this.readyState === 4) {
    req.onreadystatechange = null;
    if (this.status === 200) {
      const results = JSON.parse(this.response);
      console.log(results);
    } else {
      Xrm.Utility.alertDialog(this.statusText);
    }
  }
};
req.send(JSON.stringify(parameters));
