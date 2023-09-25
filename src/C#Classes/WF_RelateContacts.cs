using DataverseSolution.Business;
using DataverseSolution.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;

namespace DataverseSolution.Process.Account
{
    public class WF_RelateContacts : CodeActivity
    {
        [Input("ContactIDs")]
        public InArgument<string> ContactIDs { get; set; }

        [Output("Flag")]
        public OutArgument<bool> Flag { get; set; }

        [Output("Message")]
        public OutArgument<string> Message { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            IWorkflowContext workflowContext = context.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory orgServiceFactory = context.GetExtension<IOrganizationServiceFactory>();
            OrganizationServiceProxy orgService = (OrganizationServiceProxy)orgServiceFactory.CreateOrganizationService(workflowContext.UserId);


            string contactIDs = context.GetValue(ContactIDs);

            AccountBusiness buisenss = new AccountBusiness(orgService);
            ResultInfo res = buisenss.RelateContacts(contactIDs, workflowContext.PrimaryEntityId);

            context.SetValue(Flag, res.Flag);
            context.SetValue(Message, res.Message);
        }
    }
}
