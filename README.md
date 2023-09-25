# RelateContactsWebresource
In this project, we tried to create an HTML Webresource in Dynamics CRM Account Form with the help of FluentUI2 to give a consistent look & feel, which will enable users to simply search for Contacts by their names, drag and drop them to the specified tab and relate these contacts to the Account record simply by pressing a button.

The server side logic is implemented by the use of C# classes.
The client side logic is implemented by the use of Typescript rather than raw JS.

# Step1: Customizing client side
First, create a JS webresouce, such as cr12f_FluentUIWebComponents as in our example, and copy-paste the content of FluentUI>FluentUIComponent.js file in it. It is necessary, since we have used Microsoft FluentUI2 for designing our HTML tags.

Next, create another JS webresource, cr12f_SampleJS.js as in our example, to contain the Typescript's output JS file which is interperable by the browser. Note than, you can customize this JS output file, by changing the Forms>AccountForm.ts file and then npm build the project. In order to customize this outupt js file, certain devDependancies outlined in the package.json file are required: typescript, @types/xrm, and webpack. One can skip other devDependancies outlined in the file. The resulting output js file should be copy-pasted in this webresouce from the dist>ClientHooks.js file. These two webresouces will be referenced in our next and final webresouce which is our HTML webresouce: 

Create an HTML webresouce, with any name of your choice, and copy-paste contents of  HTML>AccountForm>RelatedContacts.HTML in it. (Indeed, you can use tools such as 'spkl task runner' which is developed by Scott Durew to automate this process). Then, in your Dynamics instance, add the webresource to any of the Account forms. Note that, your HTML webresouce must have a valid url link to the above two JS scripts (simply, replace your webresouces url addresses in the script tags).

# Step2: Customizing server side
In order to 1-search for contacts, and 2-relate them to the account record, we have used two simple actions: cr12f_GetCustomers and cr12f_AccountRelateContacts. 

The first action is a None(Global) action, with FullName as an input String parameter, Flag as a boolean output parameter and Message as a String output parameter. The action step must be a CodeActivity C# class that takes the FullName input parameter and provides the two output parameters. An implementation of this CodeActivity can be found in C#Classes>ContactBusiness.cs and C#Classes>WF_GetContacts.cs files. You can reimplement this logic with your logic of choice.

The second action is an Entity action (bound to Account Entity). It takes ConctactIDs which is the string of guids of contacts seperated by ',' as the input parameter. It has Flag and Message as output parameters. The action step, again, must be a CodeActivity C# class that takes the ContactIDs parameter and provides the two output parameters. Again, an implementation of it can be found in C#Classes>AccountBusiness.cs and WF_RelateContacts.cs files. Note that in our implementation, we had created an N2N relationship between Account and Contact entities called cr12f_Account_Contact which will hold the association of contacts with the account records. You can customize that too.