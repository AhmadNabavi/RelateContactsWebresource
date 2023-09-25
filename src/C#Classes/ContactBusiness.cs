using DataverseSolution.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace DataverseSolution.Business
{

    public class ContactBusiness
    {
        private OrganizationServiceProxy _service;

        public ContactBusiness(OrganizationServiceProxy service)
        {
            this._service = service;
        }

        public ResultInfo GetCustomers(string str)
        {
            QueryExpression query = new QueryExpression();
            query.NoLock = true;
            query.EntityName = "contact";
            query.ColumnSet = new ColumnSet("firstname", "lastname", "telephone1", "mobilephone");

            ConditionExpression cond_firstnamelastname = new ConditionExpression();
            cond_firstnamelastname.AttributeName = "fullname";
            cond_firstnamelastname.Operator = ConditionOperator.BeginsWith;
            cond_firstnamelastname.Values.Add(str);

            query.Criteria.AddCondition(cond_firstnamelastname);

            EntityCollection contacts = _service.RetrieveMultiple(query);

            if (contacts.Entities.Count == 0)
                return new ResultInfo { Flag = false, Message = "No contacts with similare name found!" };

            List<ContactVM> contactsVM = new List<ContactVM>();

            foreach(Entity contact in contacts.Entities)
            {
                ContactVM contactVM = new ContactVM();

                contactVM.FirstName = contact.GetAttributeValue<string>("firstname");
                contactVM.LastName = contact.GetAttributeValue<string>("lastname");
                contactVM.Phone = contact.GetAttributeValue<string>("telephone1");
                contactVM.Mobile = contact.GetAttributeValue<string>("mobilephone");
                contactVM.ID = contact.Id.ToString();

                contactsVM.Add(contactVM);
            }

            string res = JsonConvert.SerializeObject(contactsVM);

            return new ResultInfo { Flag = true, Message = res };
        }

    }
}
