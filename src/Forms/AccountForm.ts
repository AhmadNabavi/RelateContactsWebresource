/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as moment from "moment";
import Control from "xrm-mock/dist/xrm-mock-generator/control";
import { allComponents, provideFluentDesignSystem } from '@fluentui/web-components';
import { Entity } from "dataverse-ify";

provideFluentDesignSystem().register(allComponents);

export class AccountForm {

  static minimumSearchCharacter: number = 5;

  static async loadRelatedContacts(e): Promise<void> {
    debugger;

    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt')
      return;

    if (e.key === 'Tab') {
      e.target.value
        = (document.getElementById("searchhelp") as HTMLSpanElement).innerText;
      e.preventDefault();
      return;
    }

    if (e.target.value.length < 3) {
      (document.getElementById("searchhelp") as HTMLSpanElement).innerText = "";
      return;
    }

    if (sessionStorage.getItem('cache_contacts') !== null &&
      JSON.parse(sessionStorage.getItem('cache_contacts')).length > 0)
      this.autoComplete();

    if (e.target.value.length < this.minimumSearchCharacter ||
      (e.target.value.length % this.minimumSearchCharacter !== 0 &&
        e.target.value.length % this.minimumSearchCharacter === (this.minimumSearchCharacter - 1) && e.key !== 'Enter' &&
        e.target.value.length % this.minimumSearchCharacter === (this.minimumSearchCharacter - 1) && e.key !== ' ')
    )
      return;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contacts: any = null;
    //const contacts = await Xrm.WebApi.retrieveMultipleRecords("contact", "?$select=firstname,lastname,mobilephone,telephone1");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parameters: any = {};
    parameters.FullName = e.target.value;
    const req = new XMLHttpRequest();
    req.open("POST", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v9.1/cr12f_GetCustomers", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
      if (this.readyState === 4) {
        req.onreadystatechange = null;
        if (this.status === 200) {
          const results = JSON.parse(this.response);
          contacts = JSON.parse(results.Message);
        } else {
          that.showMessage(this.statusText, false);
        }
      }
    };
    await req.send(JSON.stringify(parameters));

    if (contacts === null)
      return;

    if (e.key !== "Enter")
      this.cacheContacts(contacts);
    else
      this.drawHTML(contacts);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static allowDrop(ev: any): void {
    ev.preventDefault();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static drag(ev: any): void {
    debugger;
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.nextSibling.remove();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static drop(ev: any): void {
    debugger;
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    ev.target.appendChild(document.createElement("fluent-divider"));
  }

  static async relateContacts(): Promise<void> {

    debugger;
    let message: string = "";
    let flag: boolean = false;
    const id = window.parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes: any = document.getElementById("related-contacts").children;

    let contactIds: string = "";

    for (let i = 0; i < nodes.length; ++i)
      if (i < nodes.length - 2) {
        contactIds += nodes[i].id + ",";
        i++;
      }
      else {
        contactIds += nodes[i].id;
        i++;
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parameters: any = {};
    parameters.ContactIDs = contactIds;
    const req = new XMLHttpRequest();
    req.open(
      "POST",
      window.parent.Xrm.Page.context.getClientUrl() +
      "/api/data/v9.1/accounts(" +
      id +
      ")/Microsoft.Dynamics.CRM.cr12f_AccountRelateContacts",
      false,
    );
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
      if (this.readyState === 4) {
        req.onreadystatechange = null;
        if (this.status === 200) {
          const results = JSON.parse(this.response);
          message = results.Message;
          flag = results.Flag;
          document.getElementById("related-contacts").innerHTML = "";
        } else {
          message = "Error(Not 200): " + this.statusText;
        }
      }
    };

    await req.send(JSON.stringify(parameters));

    this.showMessage(message, flag);
  }

  static showMessage(message, flag) {
    document.getElementById("snackbar").style.backgroundColor = flag ? "#A7EDE7" : "#E48586";
    document.getElementById("snackbar").innerText = message;
    const x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

  static cacheContacts(contacts) {
    sessionStorage.setItem('cache_contacts', JSON.stringify(contacts));
  }

  static drawHTML(contacts) {

    (document.getElementById("search") as HTMLInputElement).value = "";
    (document.getElementById("searchhelp") as HTMLSpanElement).innerText = "";
    const htmlAllContacts: string = document.getElementById("allcontacts").innerHTML;
    const htmlRelatedContacts: string = document.getElementById("related-contacts").innerHTML;
    let html: string = "";

    contacts.forEach(p => {

      if (htmlAllContacts.includes(p.ID) ||
        htmlRelatedContacts.includes(p.ID))
        return;

      html += "<p class='span' draggable='true' ondragstart='cds.ClientHooks.AccountForm.drag(event)'"
        + "title='Drag item and drop it in the neighbouring tab' id='"
        + p.ID + "'>"
        + " " + p.FirstName + " "
        + " " + p.LastName + " "
        + " " + p.Mobile + " "
        + " " + p.Phone + " "
        + " " + "<img src='http://localhost:5555/Development/WebResources/cr12f_ICONRemove16' onclick='cds.ClientHooks.AccountForm.removeContact(" + `"` + (p.ID as string) + `"` + ")'/>"
        + "</p>";

      html += "<fluent-divider></fluent-divider>";
    });

    document.getElementById("allcontacts").innerHTML += html;
  }

  static removeContact(id) {
    debugger;
    document.getElementById(id).nextElementSibling.remove();
    document.getElementById(id).remove();
  }

  static autoComplete() {

    debugger;

    const cachedContacts = JSON.parse(sessionStorage.getItem('cache_contacts'));
    const serachedname = (document.getElementById('search') as HTMLInputElement).value;

    const cachedContactsReduced = cachedContacts.filter(p => {
      return ((p.FirstName + p.LastName).trim()).includes(serachedname.trim());
    });

    if (cachedContactsReduced.length > 0)
      (document.getElementById('searchhelp') as HTMLSpanElement).innerText
        = cachedContactsReduced[0].FirstName + " " + cachedContactsReduced[0].LastName;
  }
}
