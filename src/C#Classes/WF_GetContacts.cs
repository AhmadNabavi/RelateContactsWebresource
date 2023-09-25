using DataverseSolution.Business;
using DataverseSolution.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;

namespace DataverseSolution.Process.Contact
{
    public class WF_GetContacts : CodeActivity
    {
        [Input("Fullname")]
        public InArgument<string> FullName { get; set; }

        [Output("Flag")]
        public OutArgument<bool> Flag { get; set; }

        [Output("Message")]
        public OutArgument<string> Message { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            IWorkflowContext workflowContext = context.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory orgServiceFactory = context.GetExtension<IOrganizationServiceFactory>();
            OrganizationServiceProxy orgService = (OrganizationServiceProxy)orgServiceFactory.CreateOrganizationService(workflowContext.UserId);

            string contactIDs = context.GetValue(FullName);

            ContactBusiness buisenss = new ContactBusiness(orgService);
            ResultInfo res = buisenss.GetCustomers(contactIDs);

            context.SetValue(Flag, res.Flag);
            context.SetValue(Message, res.Message);
        }
    }
}
