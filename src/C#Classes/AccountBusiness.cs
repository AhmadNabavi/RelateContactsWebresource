using DataverseSolution.Models;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataverseSolution.Business
{
    public class AccountBusiness
    {
        private OrganizationServiceProxy _service;

        public AccountBusiness(OrganizationServiceProxy service)
        {
            this._service = service;
        }

        public ResultInfo RelateContacts(string contactids, Guid accountid)
        {
            if (string.IsNullOrEmpty(contactids))
                return new ResultInfo { Flag = false, Message = "contactids empty" };

            string[] contacts_string = contactids.Split(',');
            List<Guid> contacts_guid = new List<Guid>();

            foreach (var contact_string in contacts_string)
            {
                try
                {
                    Guid guid = new Guid(contact_string);
                    contacts_guid.Add(guid);
                }
                catch (Exception)
                {
                    return new ResultInfo { Flag = false, Message = "Invalid contactid found" };
                }
            }

            Microsoft.Xrm.Sdk.EntityReferenceCollection contactReferences = new Microsoft.Xrm.Sdk.EntityReferenceCollection();


            foreach (var contact_guid in contacts_guid)
            {
                contactReferences.Add(new Microsoft.Xrm.Sdk.EntityReference("contact", contact_guid));

            }

            AssociateRequest associateRequest = new AssociateRequest();
            associateRequest.Target = new Microsoft.Xrm.Sdk.EntityReference("account", accountid);
            associateRequest.RelatedEntities = contactReferences;
            associateRequest.Relationship = new Microsoft.Xrm.Sdk.Relationship("cr12f_account_contact");

            try
            {
                _service.Execute(associateRequest);
            }
            catch (Exception)
            {
                return new ResultInfo { Flag = false, Message = "Error in associating contact & accounts" };
            }

            return new ResultInfo { Flag = true, Message = "Success" };
        }
    }
}
