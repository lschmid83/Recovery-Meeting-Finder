using Microsoft.AspNetCore.Mvc.Filters;
using RMF.DAL.Entities;
using RMF.DAL.Repos;
using RMF.WebAuth.Auth;
using RMF.WebAuth.Enums;
using System.Web;

namespace RMF.WebAPI.ActionFilters
{
    public class AuthorizationAttribute : ActionFilterAttribute
    {
        public UserType UserType { get; set; }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if(Authorization.IsActionPublic(UserType))
                return;

            // Check user credentials.
            var user = (User)context.HttpContext.Items["User"];
            if (user != null && Authorization.IsUserTypeAuthorized((UserType)user.Permissions, UserType))
                return;
            else {
                context.Result = new Results.UnauthorizedUser();
                context.HttpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
            };
        }
    }
}
