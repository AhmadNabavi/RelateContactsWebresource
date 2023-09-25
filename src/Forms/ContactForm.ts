/* eslint-disable prettier/prettier */
import { allComponents, provideFluentDesignSystem } from '@fluentui/web-components';
provideFluentDesignSystem().register(allComponents);

export class ContactForm {

    static onload(context): void {
        debugger;
        console.log(context);
        const formContext = context.getFormContext();

        const wrCtrl = formContext.getControl("WebResource_SampleHTML");

        if (wrCtrl !== null && wrCtrl !== undefined) {
            wrCtrl.getContentWindow().then((win) => {
                // win.setClientApiContext2(context);
                win.cds.ClientHooks.ContactForm.setClientApiContext2(Xrm, context);
            });
        }
    }

    static async setClientApiContext2(Xrm: Xrm.XrmStatic, context: Xrm.Events.EventContext) {
        debugger;

        (document.getElementById("fn") as HTMLInputElement).value = context.getFormContext().getAttribute("firstname").getValue();
        (document.getElementById("ln") as HTMLInputElement).value = context.getFormContext().getAttribute("lastname").getValue();
        (document.getElementById("mbl") as HTMLInputElement).value = context.getFormContext().getAttribute("mobilephone").getValue();
        (document.getElementById("phone") as HTMLInputElement).value = context.getFormContext().getAttribute("telephone1").getValue();
        (document.getElementById("jb") as HTMLInputElement).value = context.getFormContext().getAttribute("jobtitle").getValue();
        
        const preferedContactMethods = await Xrm.WebApi.retrieveMultipleRecords("stringmap", "?$select=attributename,attributevalue,value&$filter=attributename eq 'preferredcontactmethodcode' and objecttypecode eq 'contact'");
        
        let html: string;
        
        preferedContactMethods.entities.forEach(p => {
            html += "<fluent-option value=" + p.attributevalue + ">" + p.value + "</fluent-option>";
        });

        document.getElementById("prf").innerHTML = html;
        (document.getElementById("prf") as HTMLSelectElement).value = (context.getFormContext().getAttribute("preferredcontactmethodcode").getValue()).toString();

        document.getElementById("btn").addEventListener("click", () => {
            (document.getElementById("btn") as HTMLButtonElement).disabled = true;
            const id = context.getFormContext().data.entity.getId().replace("{", "").replace("}","");

            const data = {
                "firstname": (document.getElementById("fn") as HTMLInputElement).value,
                "lastname": (document.getElementById("ln") as HTMLInputElement).value,
                "mobilephone": (document.getElementById("mbl") as HTMLInputElement).value,
                "telephone1": (document.getElementById("phone") as HTMLInputElement).value,
                "jobtitle": (document.getElementById("jb") as HTMLInputElement).value,
                "preferredcontactmethodcode": (document.getElementById("prf") as HTMLSelectElement).value
            };

            Xrm.WebApi.updateRecord("contact", id, data);
            Xrm.Utility.openEntityForm("contact", id);
        });

    }
}
